const express = require("express");
const app = express();

const http = require("http");
const serverIO = http.Server(app);

const socketIO = require("socket.io");
const io = socketIO(serverIO);

// Containing the details of socket ids for imei
const SOCKET_MAP = new Map();

if (app) {
  console.log("Not null");
} else {
  console.log("Is null");
}

io.on("connection", socket => {
  console.log(
    "IO Connection Established...................................",
    socket.id
  );
  socket.on("REGISTER", imei => {
    console.log("imei", imei);
    socket.join(
      imei,
      () => {
        console.log("Joined");
      },
      () => {
        console.log("error");
      }
    );
  });
});

serverIO.listen(3000, () => {
  console.log(`SERVER IO started on port: 3000`);
});

sendMessageToClients = (imei, data) => {
  io.sockets.in(imei).emit("GPS DATA", data);
};

module.exports = {
  sendMessageToClients
};
