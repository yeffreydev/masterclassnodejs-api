/**
 * Async Hooks Example
 */

//Dependencies
const async_hooks = require("async_hooks");
const fs = require("fs");

//Target execution context
const targetExecutionContext = false;

//Write an arbitrary async function
const whatTimeIsit = function (callback) {
  setInterval(function () {
    fs.writeSync(1, "When the setInterval runs, the execution context is " + async_hooks.executionAsyncId() + "\n");
    callback(Date.now());
  }, 1000);
};

//Call the function

whatTimeIsit(function (time) {
  fs.writeSync(1, "The time is " + time + "\n");
});

//hooks
const hooks = {
  init(asyncId, type, triggerAsyncIc, resource) {
    fs.writeSync(1, "hook init" + asyncId + "\n");
  },
  before(asyncId) {
    fs.writeSync(1, "hook before" + asyncId + "\n");
  },
  after(asyncId) {
    fs.writeSync(1, "hook after" + asyncId + "\n");
  },
  destroy(asyncId) {
    fs.writeSync(1, "hook destroy" + asyncId + "\n");
  },
  promiseResolve(asyncId) {
    fs.writeSync(1, "hook promiseResolve" + asyncId + "\n");
  },
};

//Create a new AsyncHooks instance
const asyncHook = async_hooks.createHook(hooks);
asyncHook.enable();
