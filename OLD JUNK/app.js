// Include Nodejs' net module.
const express = require("express");
const app = express();
const Net = require("net");
const Data = require("../model/data");
const Parser = require("teltonika-parser");
const binutils = require("binutils64");
// The port on which the server is listening.
const port = 8090;
// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new Net.Server();
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function() {
  console.log(
    `Server listening for connection requests on socket localhost:${port}`
  );
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on("connection", socket => {
  console.log("A new connection has been established.");

  // Now that a TCP connection has been established, the server can send data to
  // the client by writing to its socket.
  const x = new Uint8Array([0, 0, 0, 0, 0, 0, 0]);

  // The server can also receive data from the client by reading from its socket.
  socket.on("data", chunk => {
    socket.write(new Uint8Array([0x01]));
    socket.write(new Uint8Array(chunk.length));
    // Data.create({
    //     packet: chunk
    // })
    //     .then(result => {
    //         // console.log(result);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     });
    console.log(
      "Data received from client:" + chunk.toString() + " Time: " + new Date()
    );
  });

  // When the client requests to end the TCP connection with the server, the server
  // ends the connection.
  socket.on("end", function() {
    console.log("Closing connection with the client");
  });

  // Don't forget to catch error, for your own sake.
  socket.on("error", function(err) {
    console.log(`Error: ${err}`);
  });
});
const PORT = process.env.PORT || 6000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
