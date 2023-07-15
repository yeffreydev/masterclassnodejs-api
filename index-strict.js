/**
 * primary file for the api
 */
"use strict";

//Dependencies
const server = require("./lib/server");
const workers = require("./lib/wokers");
const cli = require("./lib/cli");

// Declare the app
const app = {};

//Declare a global (that strict mode should catch)
foo = "bar";

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
