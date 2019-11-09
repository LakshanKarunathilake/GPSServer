const io = require("socket.io-client");

const socket = io.connect("http://localhost:3000");

socket.on("GPS DATA", data => {
  console.log("-----");
  console.log("data", data);
});

socket.emit("REGISTER", "352093082285320");
