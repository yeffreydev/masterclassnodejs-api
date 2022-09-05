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

  // Get the HTTP Method
  var method = req.method.toLowerCase();

  //Get the query string as an object
  var queryStringObject = parseUrl.query;

  //send the response
  res.end("hello world\n");

  //log the request path
  console.log(
    "Request received on path: " +
      trimePath +
      " with this method: " +
      method +
      " and with these query string parameters",
    JSON.stringify(queryStringObject)
  );
});

//start the server, nad have it lsten on port 3000

server.listen(3000, function () {
  console.log("the server is listening on port 3000 now");
});
