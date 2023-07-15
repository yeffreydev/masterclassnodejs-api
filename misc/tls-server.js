/**
 * Example TLS Server
 * List to port 6000 and sends the world 'pong' to client's
 */

//Dependencies
const tls = require("tls");
const fs = require("fs");
const path = require("path");

const options = {
  key: fs.readFileSync(path.join(__dirname, "./../https/key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "./../https/cert.pem")),
};

//Create the server
const server = tls.createServer(options, function (connection) {
  //Send the world 'pong'
  let outboundMessage = "pong";
  connection.write(outboundMessage);

  //When the client writes something, log it out.
  connection.on("data", function (inboundMessage) {
    let messageString = inboundMessage.toString();
    console.log("I wrote " + outboundMessage + " and they said " + messageString);
  });
});

//Listen
server.listen(6000);
