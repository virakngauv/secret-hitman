import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import GameStore from "./GameStore.js";
import { generateRandomId } from "./helpers/util/index.js"
import UserStore from "./UserStore.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const gameStore = new GameStore();
const userStore = new UserStore();

app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./build" });
});

io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  if (userID) {
    console.log("userID is ", userID);
    return next();
  } 

  socket.userID = generateRandomId();
  next();
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} has connected`);

  socket.emit("userID", {
    userID: socket.userID,
  });

  socket.on("createGame", (name, goToLobby) => {
    // const userID = generateRandomId();
    const userID = socket.userID;
    const roomCode = gameStore.createGame();
    userStore.addRoomCode(userID, roomCode);
    gameStore.addNewPlayerToGame(userID, name, roomCode);
    socket.join(roomCode);
    goToLobby(roomCode);
  });

  socket.on("joinGame", (name, roomCode, goToLobby) => {
    if (gameStore.hasGame(roomCode)) {
      const userID = generateRandomId();
      gameStore.addNewPlayerToGame(userID, name, roomCode);
      socket.join(roomCode);
      socket.broadcast.to(roomCode).emit("playerChange");
      goToLobby(roomCode);
    }

  });

  socket.on("getPlayers", (roomCode, setPlayers) => {
    if (gameStore.hasGame(roomCode)) {
      const players = Array.from(gameStore.getGame(roomCode).players.values());
      setPlayers(players);
    }
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} has disconnected`);
    // const roomCode = userStore.getRoomCode(userID);
    // gameStore.deletePlayerFromGame(userID, roomCode);
  })

  // TODO: socket.on("disconnect") -> remove from room and emit "playerChange" event
  //  https://socket.io/docs/v4/server-socket-instance/#disconnect

});

httpServer.listen(80);