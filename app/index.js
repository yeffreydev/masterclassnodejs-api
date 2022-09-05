/**
 * primary file for the api
 */

//dependencies

var http = require("http");
var url = require("url");
var StringDecoder = require("string_decoder").StringDecoder;

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

    //send the response
    res.end("hello world\n");

    //log the request path
    console.log("request received with these headers", headers);
    console.log("request received with this payload: ", buffer);
    console.log("Request received on path: ", trimePath);
    console.log("request received with this method: ", method);
    console.log(
      "request received with these query string parameters",
      JSON.stringify(queryStringObject)
    );
  });
});

//start the server, nad have it lsten on port 3000
server.listen(3000, function () {
  console.log("the server is listening on port 3000 now");
});
