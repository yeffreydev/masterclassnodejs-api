/**
 * primary file for the api
 */

//Dependencies
var server = require("./lib/server");
var workers = require("./lib/wokers");
var cli = require("./lib/cli");

// Declare the app
var app = {};
//Init function
app.init = function () {
  //Start the server
  server.init();
  //Start the workers
  workers.init();
  //Start the Cli, but make sure it starts last
  setTimeout(function () {
    cli.init();
  }, 50);
};

//execute
app.init();

//export the app;

module.exports = app;
