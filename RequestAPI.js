const net = require("net");

let receiver = net.createServer(connection => {
  console.log("new client");

  connection.on("data", data => {
    connection.write(data + "\r\n");
  });

  connection.on("end", () => {
    console.log("client left");
  });

  connection.on("connect", () => {
    console.log("On conncet");
  });
});

receiver.listen(8091, () => {
  console.log("TCP Receiver Server started");
});
