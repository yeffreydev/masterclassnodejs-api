/**
 * Example UDP client
 * sending a message to a UDP server on port 6000
 *
 */

//Dependencies
var dgram = require("dgram");

//create the client
var client = dgram.createSocket("udp4");

//Define the message and pull it into a buffer
var messageString = "This is a message";
var messgeBuffer = Buffer.from(messageString);

//Send off the message
client.send(messgeBuffer, 6000, "localhost", function (err) {
  client.close();
});
