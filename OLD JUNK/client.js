const net = require("net");

const options = {
  port: 8091
};

const client = net.createConnection(options, () => {
  client.write("352093082285320");
});

client.on("data", data => {
  console.log(data.toString());
});

client.on("error", err => {
  console.log("err", err);
});
