const players = [];
worldTiles = { x: 100, y: 60 };
let tileSize = {
  width: 40,
  height: 40,
};
world = {
  width: 4000, //tileSize.width*worldTiles.x
  height: 2400, //tilesSize.height*worldTiles.y
};
let map =[[]];

module.exports = (io) => {
  myio = io;
  io.on("connection", (socket) => {
    io.emit("server", "connected online " + players.length);
    io.emit("world", world);

    //create new player if join request
    socket.on("join", (id) => {
      const me = players.find((player) => player.id == id);
      if (!me) {
        players.push({
          id,
          x: 0,
          y: 0,
          width: tileSize.width,
          height: tileSize.height,
          speed: 5,
        });
      }
    });

    //create new player if join request
    socket.on("load_world", (id) => {
      if(id==""){
        //map=loadMapFromDB        
      }else{
        map=generateWorldMap()
      }

      io.emit("load_world",map)
    });

    //send players data updater
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

//player movement
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

// Fungsi untuk membuat dan memodifikasi peta
function generateWorldMap() {
  const sky = 20;
  const rocks = 30 * 3;
  const lavas = 30 * 6;
  const dirtStartY = 20;
  const rockStartY = 21; // Mengubah startY untuk rock menjadi 21
  const lavaStartY = 40; // Mengubah startY untuk lava menjadi 51

  // Membuat peta kosong
  const map = Array.from({ length: worldTiles.y }, () =>
    Array(worldTiles.x).fill(0)
  );

  // Menambahkan lapisan tanah (dirt) di bagian bawah peta
  for (let y = dirtStartY; y < worldTiles.y; y++) {
    for (let x = 0; x < worldTiles.x; x++) {
      map[y][x] = 1; // Dirt
    }
  }

  // Menambahkan blok batu (rock) secara acak di area yang sesuai
  for (let i = 0; i < rocks; i++) {
    const randomX = Math.floor(Math.random() * worldTiles.x);
    const randomY =
      Math.floor(Math.random() * (worldTiles.y - rockStartY)) + rockStartY;
    map[randomY][randomX] = 2; // Rock
  }

  // Menambahkan blok lava secara acak di area yang sesuai
  for (let i = 0; i < lavas; i++) {
    const randomX = Math.floor(Math.random() * worldTiles.x);
    const randomY =
      Math.floor(Math.random() * (worldTiles.y - lavaStartY)) + lavaStartY;
    map[randomY][randomX] = 3; // Lava
  }

  return map;
}
