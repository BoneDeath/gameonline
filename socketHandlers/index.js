const players = [];
let world = { width: 2000, height: 2000 };


module.exports = (io) => {
  myio = io;
  io.on("connection", (socket) => {
    io.emit("server", "connected online " + players.length);
    io.emit("world", world);

    socket.on("join", (id) => {
      const me = players.find((player) => player.id == id);
      if (!me) {
        players.push({ id, x: 0, y: 0, width: 50, height: 50, speed: 5 });
      }
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

function updatePlayerPosition(id, move) {
  const me = players.find((player) => player.id == id);

  if (me) {
    switch (move) {
      case "up":
        me.y = Math.max(0, me.y - me.speed);
        break;
      case "down":
        me.y = Math.min(world.height - me.height, me.y + me.speed);
        break;
      case "left":
        me.x = Math.max(0, me.x - me.speed);
        break;
      case "right":
        me.x = Math.min(world.width - me.width, me.x + me.speed);
        break;
    }
  } else {
    console.log("your character not in this world");
  }
}
