/**
 * Example TCP (net) Server
 * List to port 6000 and sends the world 'pang' to client's
 */

//Dependencies
var net = require("net");

//Create the server
var server = net.createServer(function (connection) {
  //Send the world 'pong'
  var outboundMessage = "pong";
  connection.write(outboundMessage);

  //When the client writes something, log it out.
  connection.on("data", function (inboundMessage) {
    var messageString = inboundMessage.toString();
    console.log("I wrote " + outboundMessage + " and they said " + messageString);
  });
});

//Listen
server.listen(6000);
