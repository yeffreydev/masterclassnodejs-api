/*
 *Library that demostrates something throwing when it's init () is called
 */

//Container for the module
var example = {};

//Init function
example.init = function () {
  //Ths is an error created intentionally (bar is not defined)
  var foo = bar;
};

//export the module
module.exports = example;
