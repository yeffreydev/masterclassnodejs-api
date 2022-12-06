/**
 * primary file for the api
 */

//Dependencies
var server = require("./lib/server");
var workers = require("./lib/wokers");

// Declare the app
var app = {};
//Init function
app.init = function () {
  //Start the server
  server.init();
  //Start the workers
  workers.init();
};

//execute
app.init();

//export the app;

module.exports = app;
