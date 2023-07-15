/**
 * primary file for the api
 */

//Dependencies
const server = require("./lib/server");
const workers = require("./lib/wokers");
const cli = require("./lib/cli");
const exampleDebugginProblem = require("./lib/exampleDebugginProblem");

// Declare the app
const app = {};
//Init function
app.init = function () {
  //Start the server
  debugger;
  server.init();
  debugger;
  //Start the workers
  debugger;
  workers.init();
  debugger;

  //Start the Cli, but make sure it starts last
  debugger;
  setTimeout(function () {
    cli.init();
  }, 50);
  debugger;

  //Set foo at 1
  debugger;
  const foo = 1;
  console.log("Just assigned 1 to foo");
  debugger;

  //Increment foo
  foo++;
  console.log("Just incremented foo");
  debugger;

  //Square foo
  foo = foo * foo;
  console.log("Just Squared foo");
  debugger;

  //Convert foo to a string
  foo = foo.toString();
  console.log("Just converted foo to string");
  debugger;

  //call the init script that will throw
  exampleDebugginProblem.init();
  console.log("Just called the library");
  debugger;
};

//execute
app.init();

//export the app;

module.exports = app;
