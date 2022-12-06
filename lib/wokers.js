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
      ? timeOutSeconds.method
      : false;

  // Set the keys that may not be set (if the workers have never seen this check before)
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
