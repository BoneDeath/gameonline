// socketHandlers.js
const players = [];

function Player(id, x, y) {
  this.id = id;
  this.x = x;
  this.y = y;
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    io.emit("server", "connected to server");

    socket.on("join", (id) => {
      players.push(new Player(id, 0, 0));
    });

    socket.on("update", () => {
      io.emit("update", players);
    });

    socket.on("move", (data) => {
      const me = players.find((player) => player.id === data.id);
      if (me) {
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
      }
    });
  });
};
