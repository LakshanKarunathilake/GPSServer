const net = require("net");
const Parser = require("teltonika-parser");
const binutils = require("binutils64");

const GPSData = require("../model/GPSData");
const GPS_Client = require("./GPS_Client");
// Listen To TCP server
const listenToTCPServer = () => {
  const server = createTelTronikaServer();
  server.listen(8090, () => {
    console.log("Teltronika TCP Server started");
  });
};

// Creating a Teltronic TCP Server
function createTelTronikaServer() {
  return net.createServer(connection => {
    let imei = 0;
    console.log(
      "CONNECTED: " + connection.remoteAddress + ":" + connection.remotePort
    );

    console.log("client connected");
    connection.on("end", () => {
      console.log("client disconnected");
    });

    connection.on("data", data => {
      const parser = new Parser(data);
      console.log("parser", parser);
      if (parser.isImei) {
        imei = parseInt(parser.imei);
        connection.write(Buffer.alloc(1, 1));
      } else {
        let avl = parser.getAvl();

        const writer1 = new binutils.BinaryWriter();
        writer1.WriteInt32("getver");
        const response = writer1.ByteBuffer;
        connection.write(response);

        const gps_data = {
          imei: imei,
          latitude:
            avl && avl.records && avl.records.length > 0
              ? avl.records[0].gps.latitude
              : 0,
          longitude:
            avl && avl.records && avl.records.length > 0
              ? avl.records[0].gps.longitude
              : 0
        };
        // if (avl.records && avl.records.length > 0) {
        //   avl.records.forEach(element => {
        //     // Sending GPS DATA to  SOCKETS
        //     GPS_Client.sendMessageToClients(imei, element);
        //   });
        // }
        GPSData.create(gps_data)
          .then(() => {
            const writer = new binutils.BinaryWriter();
            writer.WriteInt32(avl.number_of_data);
            const response = writer.ByteBuffer;
            connection.write(response);
          })
          .catch(err => {
            console.log("Error");
          });
      }
    });
  });
}

module.exports = {
  createTelTronikaServer,
  listenToTCPServer
};
