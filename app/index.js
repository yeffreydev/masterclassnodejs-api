/**
 * primary file for the api
 */

//dependencies

var http = require("http");
var url = require("url");

//thes erver should respond to all requests with a string
var server = http.createServer(function (req, res) {
  //get the url and parse it
  var parseUrl = url.parse(req.url, true);

  // get the path
  var path = parseUrl.pathname;
  var trimePath = path.replace(/^\/+|\/+$/g, "");

  //send the response
  res.end("hello world\n");

  //log the request path
  console.log("Request received on path: " + trimePath);
});

//start the server, nad have it lsten on port 3000

server.listen(3000, function () {
  console.log("the server is listening on port 3000 noew");
});
