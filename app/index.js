/**
 * primary file for the api
 */

//dependencies

var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;
var config = require("./config");

//thes erver should respond to all requests with a string
var server = http.createServer(function (req, res) {
  //get the url and parse it
  var parseUrl = url.parse(req.url, true);

  // get the path
  var path = parseUrl.pathname;
  var trimePath = path.replace(/^\/+|\/+$/g, "");

  //Get the query string as an object
  var queryStringObject = parseUrl.query;

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  //Get the headers as an object
  var headers = req.headers;

  //Get the payload, if any
  var decoder = new StringDecoder("utf-8");
  var buffer = "";
  req.on("data", function (data) {
    buffer += decoder.write(data);
  });
  req.on("end", function () {
    buffer += decoder.end();

    //Choose the handler this request should go to. If one it not found, use the notFound handler
    var chosenHandler =
      typeof router[trimePath] != "undefined"
        ? router[trimePath]
        : handlers.notFound;

    //Construct the data object to send to the handler
    var data = {
      trimePath,
      queryStringObject,
      method,
      headers,
      payload: buffer,
    };

    //Route the request to the handler specified in the router
    chosenHandler(data, function (statusCode, payload) {
      //Use thes status code called back by the handler, or default 200
      statusCode = typeof statusCode == "number" ? statusCode : 200;

      //use the payload calld back by teh handler, or default empty object
      payload = typeof payload == "object" ? payload : {};

      //Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      //Return the response
      res.setHeader("Content-Type", "application/json");
      res.writeHead(statusCode);
      res.end(payloadString);

      //log the request path
      console.log("Return this response: ", statusCode, payloadString);
    });
  });
});

//start the server
server.listen(config.port, function () {
  console.log(
    "the server is listening on port " +
      config.port +
      " in " +
      config.envName +
      " mode"
  );
});

//Define the handleres
var handlers = {};

//sample handler
handlers.sample = function (data, callback) {
  //Callback a http status code, and a payload object
  callback(406, { name: "sample handler" });
};

//Not found hanlder
handlers.notFound = function (data, callback) {
  callback(404);
};

//define a request router.
var router = {
  sample: handlers.sample,
};
