import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import GameStore from "./games.js";
import { generateRandomId } from "./helpers/util/index.js"

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const gameStore = new GameStore();

app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./build" });
});

io.on("connection", (socket) => {
  console.log("user has connected");

  socket.on("createGame", (name, goToLobby) => {
    const userID = generateRandomId();
    const roomCode = gameStore.createGame(userID, name);
    goToLobby(roomCode);
  });

  socket.on("getPlayers", (roomCode, setPlayers) => {
    if (gameStore.hasGame(roomCode)) {
      const players = Array.from(gameStore.getGame(roomCode).players.values());
      setPlayers(players);
    }
  })
});

httpServer.listen(80);