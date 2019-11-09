const net = require("net");
const Parser = require("teltonika-parser");
const binutils = require("binutils64");
const GPSData = require("../model/GPSData");

let express = require("express");

let app = express();
global.app = app;

let http = require("http");
let serverIO = http.Server(app);
let sockets = [];

let socketIO = require("socket.io");
let io = socketIO(serverIO);

let connectionsArray = [];

let toBeSent = [];
let POLLING_INTERVAL = 3000;
let pollingTimer;

let mainServer = net.createServer(connection => {
  let imei = 0;
  console.log(
    "CONNECTED: " + connection.remoteAddress + ":" + connection.remotePort
  );
  sockets.push(connection);

  console.log("client connected");
  connection.on("end", () => {
    console.log("client disconnected");
  });

  connection.on("data", data => {
    let parser = new Parser(data);
    console.log("pa", parser.parseHeader());
    if (parser.isImei) {
      imei = parseInt(parser.imei);
      console.log("imei", imei);
      connection.write(Buffer.alloc(1, 1));
      writeToExternals("Emei record");
    } else {
      let avl = parser.getAvl();
      GPSData.create({
        imei: imei,
        latitude:
          avl && avl.records && avl.records.length > 0
            ? avl.records[0].gps.latitude
            : 0,
        longitude:
          avl && avl.records && avl.records.length > 0
            ? avl.records[0].gps.longitude
            : 0
      })
        .then(() => {
          let writer = new binutils.BinaryWriter();
          writer.WriteInt32(avl.number_of_data);
          console.log("gps data", imei);
          let response = writer.ByteBuffer;

          connection.write(response);
          writeToExternals("Sending response");
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

  connection.on("close", () => {
    let index = sockets.findIndex(function(o) {
      return (
        o.remoteAddress === connection.remoteAddress &&
        o.remotePort === connection.remotePort
      );
    });
    if (index !== -1) sockets.splice(index, 1);
    console.log(
      "CLOSED: " + connection.remoteAddress + " " + connection.remotePort
    );
  });

  connection.on("error", function(err) {
    console.log(`Error: ${err}`);
  });
});

mainServer.listen(8090, () => {
  console.log("TCP Server started");
});

let receiver = net.createServer(connection => {
  console.log("new client");

  connection.on("data", IMEI => {
    console.log("IMEI", IMEI);
    toBeSent.push(connection);
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

var pollingLoop = function() {
  GPSData.findOne({
    order: [["id", "DESC"]]
  })
    .then(result => {
      if (connectionsArray.length) {
        pollingTimer = setTimeout(pollingLoop, POLLING_INTERVAL);

        updateSockets({
          gpsData: result
        });
      } else {
        console.log(
          "The server timer was stopped because there are no more socket connections on the app"
        );
      }
    })
    .catch(e => {
      console.log("db error" + e);
      updateSockets(e);
    });
};

// creating a new websocket to keep the content updated without any AJAX request
io.sockets.on("connection", function(socket) {
  console.log("Number of connections:" + connectionsArray.length);
  // starting the loop only if at least there is one user connected
  if (!connectionsArray.length) {
    pollingLoop();
  }

  socket.on("disconnect", function() {
    var socketIndex = connectionsArray.indexOf(socket);
    console.log("socketID = %s got disconnected", socketIndex);
    if (~socketIndex) {
      connectionsArray.splice(socketIndex, 1);
    }
  });

  console.log("A new socket is connected!");
  connectionsArray.push(socket);
});

updateSockets = function(data) {
  // adding the time of the last update
  data.time = new Date();
  console.log(
    "Pushing new data to the clients connected ( connections amount = %s ) - %s",
    connectionsArray.length,
    data.time
  );
  // sending new data to all the sockets connected
  connectionsArray.forEach(function(tmpSocket) {
    tmpSocket.volatile.emit(352093082285320, data);
  });
};

writeToExternals = data => {
  toBeSent.forEach(connection => connection.write(data));
};

const port = process.env.PORT || 3000;

serverIO.listen(port, () => {
  console.log(`started on port: ${port}`);
});
