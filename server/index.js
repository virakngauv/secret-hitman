import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import GameStore from "./games.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const gameStore = new GameStore();

app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./build" });
});

io.on("connection", (socket) => {
  socket.on("createRoom", (goToLobby) => {
    const roomCode = gameStore.createRoom();
    goToLobby(roomCode);
  })
});

httpServer.listen(80);