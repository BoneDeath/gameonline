const players =[];

function updatePlayerPosition(id, move) {
  const me = players.find(player =>player.id == id);
  if (me) {
    switch (move) {
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
}

module.exports = (io) => {
  io.on("connection", (socket) => {
    io.emit("server", "connected to server");

    socket.on("join", (id) => {
      players.push({ id, x: 0, y: 0 });
    });

    socket.on("update", () => {
      io.emit("update", players);
    });

    socket.on("move", (data) => {
      if (data && data.id && data.move) {
        updatePlayerPosition(data.id, data.move);
      }
    });
  });
};
