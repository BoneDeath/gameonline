const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");
const router = require("./routes");
const socketHandlers = require("./socketHandlers");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use("/", router);

socketHandlers(io);

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});