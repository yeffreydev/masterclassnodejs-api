/**
 * primary file for the api
 */

//dependencies

var http = require("http");
var url = require("url");

//thes erver should respond to all requests with a string
var server = http.createServer(function (req, res) {
  res.end("hello world\n");
});

//start the server, nad have it lsten on port 3000

server.listen(3000, function () {
  console.log("the server is listening on port 3000 noew");
});
