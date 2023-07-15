/**
 * Example udp server
 * creating a UDP datagram server listning on 5000
 */

//Dependencies
const dgram = require("dgram");

///Creating a server
const server = dgram.createSocket("udp4");

server.on("message", function (messageBuffer, sender) {
  //Do something with an incoming message or do something with the sender
  let messageString = messageBuffer.toString();
  console.log(messageString);
});

//Bind to 6000
server.bind(6000);
