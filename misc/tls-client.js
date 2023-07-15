/**
 * Example TLS Client
 *
 * connects to port 6000 and send the world 'ping' to server
 */

//Dependencies
const tls = require("tls");
const fs = require("fs");
const path = require("path");

//Server options
const options = {
  ca: fs.readFileSync(path.join(__dirname, "./../https/cert.pem")), //Only required because we're sing a selft-signed certificate
};

//define the message to send
const outboundMessage = "ping";

//Create the client
const client = tls.connect(6000, options, function () {
  //Send the message
  client.write(outboundMessage);
});

//When the server writes back, log what is says then kill the client

client.on("data", function (inboundMessage) {
  let messageString = inboundMessage.toString();
  console.log("I wrote " + outboundMessage + " and they said " + messageString);
  client.end();
});
