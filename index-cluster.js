/**
 * primary file for the api
 */

//Dependencies
const server = require("./lib/server");
const workers = require("./lib/wokers");
const cli = require("./lib/cli");
const cluster = require("cluster");
const os = require("os");

// Declare the app
const app = {};
//Init function
app.init = function (callback) {
  //If we're on the master thread, start the background workers and cli
  if (cluster.isMaster) {
    //Start the workers
    workers.init();
    //Start the Cli, but make sure it starts last
    setTimeout(function () {
      cli.init();
      callback();
    }, 50);

    ///Fork the process
    for (const i = 0; i < os.cpus().length; i++) {
      cluster.fork();
    }
  } else {
    //If we're not on the master thread, start the http start
    server.init();
  }
};

//self invoking only if required directly
if (require.main === module) {
  app.init(function () {});
}

//export the app;

module.exports = app;
