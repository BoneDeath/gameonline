const players = [];
let world = { width: 2000, height: 2000 };
let canvas = {};
let camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };

function updateCamera(me) {
  camera.x = Math.max(
    0,
    Math.min(world.width - camera.width, me.x - camera.width / 2)
  );
  camera.y = Math.max(
    0,
    Math.min(world.height - camera.height, me.y - camera.height / 2)
  );
}

module.exports = (io) => {
  myio = io;
  io.on("connection", (socket) => {
    io.emit("server", "connected online " + players.length);
    io.emit("world", world);
    io.emit("camera", camera);

    socket.on("join", (id) => {
      const me = players.find((player) => player.id == id);
      if (!me) {
        players.push({ id, x: 0, y: 0, width: 50, height: 50, speed: 5 });
      }
    });

    socket.on("canvas", (playerCanvas) => {
      canvas = playerCanvas;
      camera.width = playerCanvas.width;
      camera.height = playerCanvas.width;
    });

    socket.on("update", () => {
      io.emit("update", players);
    });

    socket.on("move", (data) => {
      if (data && data.id && data.move) {
        updatePlayerPosition(data.id, data.move);
        myio.emit("camera", camera);
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
    updateCamera(me);
  } else {
    console.log("your character not in this world");
  }
}
