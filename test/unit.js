/**
 *Unit tests

 */

//Dependencies
var helpers = require("./../lib/helpers");
var assert = require("assert");
var logs = require("./../lib/logs");
var exampleDebugggigProblem = require("./../lib/exampleDebugginProblem");

//Holder for tests
var unit = {};

//Assert that the getANumber function is returning a number
unit["helpers.getANumber should return a number"] = function (done) {
  var val = helpers.getANumber();
  assert.equal(typeof val, "number");
  done();
};

//Assert that the getANumber function is returning a 1
unit["helpers.getANumber should return 1"] = function (done) {
  var val = helpers.getANumber();
  assert.equal(val, 1);
  done();
};

//Assert that the getANumber function is returning a 2
unit["helpers.getANumber should return 2"] = function (done) {
  var val = helpers.getANumber();
  assert.equal(val, 2);
  done();
};

//logs.list should callback an array and a false error
unit["logs.list should callback a false error and array of log names"] = function (done) {
  logs.list(true, function (err, logFileNames) {
    assert.equal(err, false);
    assert.ok(logFileNames instanceof Array);
    assert.ok(logFileNames.length);
    done();
  });
};

//Logs.truncate should not trhow if the logId doesnt exist
unit["logs.truncate should not throw if the logId does not exist. It should callback an error instead"] = function (done) {
  assert.doesNotThrow(function () {
    logs.truncate("I do not exist", function (err) {
      assert.ok(err);
      done();
    });
  }, TypeError);
};

//ExampleDebuggingProblem.init should not throw  (but it does)
unit["exampleDebuggingProble.init should not throw when called"] = function (done) {
  assert.doesNotThrow(function () {
    exampleDebugggigProblem.init();
    done();
  }, TypeError);
};

//Export the tests to the runner
module.exports = unit;
