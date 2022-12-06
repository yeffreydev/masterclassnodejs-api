/**
 * worker-related task
 *
 */

//dependencies
var path = require("path");
var fs = require("fs");
var _data = require("./data");
var https = require("https");
var http = require("http");
var helpers = require("./helpers");
var url = require("url");

//instantiate the worker object
var workers = {};

//Lookup all checks, get their data, send to a validator
workers.gatherAllChecks = function () {
  // Get all the checks
  _data.list("checks", function (err, checks) {
    if (!err && checks && checks.length > 0) {
      checks.forEach(function (check) {
        //Read in the check data
        _data.read("checks", check, function (err, originalCheckData) {
          if (!err && originalCheckData) {
            //passs it to the check validator, and let that function continue or log errors as needed
            workers.validateCheckData(originalCheckData);
          } else {
            console.log("Error reading one of the checks data");
          }
        });
      });
    } else {
      console.log("Error: Could not find any checks to process");
    }
  });
};

//Sanity-check the check-data
workers.validateCheckData = function (originalCheckData) {
  originalCheckData =
    typeof originalCheckData == "object" && originalCheckData !== null
      ? originalCheckData
      : {};
  originalCheckData.id =
    typeof originalCheckData.id == "string" &&
    originalCheckData.id.trim().length == 20
      ? originalCheckData.id.trim()
      : false;
  originalCheckData.userPhone =
    typeof originalCheckData.userPhone == "string" &&
    originalCheckData.userPhone.trim().length == 10
      ? originalCheckData.userPhone.trim()
      : false;
  originalCheckData.protocol =
    typeof originalCheckData.protocol == "string" &&
    ["http", "https"].indexOf(originalCheckData.protocol) > -1
      ? originalCheckData.protocol.trim()
      : false;
  originalCheckData.url =
    typeof originalCheckData.url == "string" &&
    originalCheckData.url.trim().length > 0
      ? originalCheckData.url.trim()
      : false;
  originalCheckData.method =
    typeof originalCheckData.method == "string" &&
    ["post", "get", "put", "delete"].indexOf(originalCheckData.method) > -1
      ? originalCheckData.method
      : false;
  originalCheckData.successCodes =
    typeof originalCheckData.successCodes == "object" &&
    originalCheckData.successCodes instanceof Array &&
    originalCheckData.successCodes.length > 0
      ? originalCheckData.successCodes
      : false;
  originalCheckData.timeOutSeconds =
    typeof timeOutSeconds.method == "number" &&
    originalCheckData.timeOutSeconds % 1 === 0 &&
    originalCheckData.timeOutSeconds >= 1 &&
    originalCheckData.timeOutSeconds <= 5
      ? timeOutSeconds.timeOutSeconds
      : false;

  // Set the keys that may not be set (if the workers have never seen this check before)
  originalCheckData.state =
    typeof originalCheckData.state == "string" &&
    ["up", "down"].indexOf(originalCheckData.state) > -1
      ? originalCheckData.state
      : "down";
  originalCheckData.lastChecked =
    typeof timeOutSeconds.lastChecked == "number" &&
    originalCheckData.lastChecked > 0
      ? timeOutSeconds.lastChecked
      : false;

  //if al lthe checks pass, pass the data along to the next stop in the proccess
  if (
    originalCheckData.id &&
    originalCheckData.userPhone &&
    originalCheckData.protocol &&
    originalCheckData.url &&
    originalCheckData.method &&
    originalCheckData.successCodes &&
    originalCheckData.timeOutSeconds
  ) {
    workers.performCheck(originalCheckData);
  } else {
    console.log(
      "Error: one of the checks is not properly formatted. Skipping it. "
    );
  }
};

//Perform the check, send the originalCheckData and the outcome of the check proccess to the next setp in the process
workers.performCheck = function (originalCheckData) {
  //Prepare the inital check outcome
  var checkOutcome = {
    error: false,
    responseCode: false,
  };
  //Mark that the outcome has not been sent yet
  var outcomeSent = false;

  //Parse the hostname and the path out of the original check data
  var parsedUrl = url.parse(
    originalCheckData.protocol + "://" + originalCheckData.url,
    true
  );
  var hostName = parsedUrl.hostname;
  var path = parsedUrl.path; //Using path and not 'pathname' because we want the query string.

  //Construct the request
  var requestDetails = {
    protocol: originalCheckData.protocol + ":",
    hostname: hostName,
    method: originalCheckData.method.toUpperCase(),
    path: path,
    timeout: originalCheckData.timeOutSeconds * 1000,
  };
  //Instatiate the request object (using either the http or https module)
  var _moduleToUse = originalCheckData.protocol == "http" ? http : https;
  var req = _moduleToUse.request(requestDetails, function (re) {
    //Grab the status of the sent request
    var status = res.statusCode;

    //update the checkoutcome and pass the data along
    checkOutcome.responseCode = status;
    if (!outcomeSent) {
      workers.procesCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });
  // Bind the to the error event so it dosen't get thrown
  req.on("error", function (e) {
    //update the checkoutcome and pass the data along
    checkOutcome.error = { error: true, value: e };
    if (!outcomeSent) {
      workers.procesCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  //Bind to the timeout event
  req.on("timeout", function (e) {
    //update the checkoutcome and pass the data along
    checkOutcome.error = { error: true, value: "timeout" };
    if (!outcomeSent) {
      workers.procesCheckOutcome(originalCheckData, checkOutcome);
      outcomeSent = true;
    }
  });

  // End the request
  req.end();
};

//Process the check outcome, update the checkd data ad needed,trigger and alert if needed
//Special logic for accomodating a check that has never been tested before (don't alert on that one)
workers.procesCheckOutcome = function (originalCheckData, checkOutcome) {
  //Decide if the check is considered up or down
  var state =
    !checkOutcome.error &&
    checkOutcome.responseCode &&
    originalCheckData.successCodes.indexOf(checkOutcome.responseCode) > -1
      ? "up"
      : "down";
  //Decide if an alert is worranted
  var alertWarranted =
    originalCheckData.lastChecked && originalCheckData.state != state;

  //Update the check data.
};

//Timer to execute the worker-proccess once per minute
workers.loop = function () {
  setInterval(function () {
    workers.gatherAllChecks();
  }, 1000 * 60);
};

//Init script
workers.init = function () {
  //Execute all the checks immediately
  workers.gatherAllChecks();
  //call the loop so the checks will execute later on
  workers.loop();
};

//Export the module
module.exports = workers;
