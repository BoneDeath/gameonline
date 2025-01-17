const express = require("express");
const { createServer } = require("node:http");
const { join } = require("node:path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

//player prototype
players = [];
player = function (id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
};

//send client ui
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  //first emit without request from client
  io.emit("server", "connected to server");

  //when client request join create new player
  socket.on("join", (id) => {
    players.push(new player(id, 0, 0));
  });

  //when client request update send players data
  socket.on("update", (data) => {
    io.emit("update", players);
  });

  //when client request move then move player based on client id
  socket.on("move", (data) => {
    const me = players.find((prop) => prop.id === data.id);
    switch (data.move) {
      case "left":
        me.x -= 1;
        break;
      case "up":
        me.y -= 1;
        break;
      case "right":
        me.x += 1;
        break;
      case "down":
        me.y += 1;
        break;
    }
  });
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});
