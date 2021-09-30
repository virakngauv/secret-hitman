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
  const playerID = socket.handshake.auth.playerID;
  if (userID && playerID) {
    console.log("(server) userID is ", userID);
    console.log("(server) playerID is ", playerID);
    socket.userID = userID;
    socket.playerID = playerID;
    return next();
  } 

  socket.userID = generateRandomId();
  socket.playerID = generateRandomId();
  next();
});

io.on("connection", (socket) => {
  console.log(`user ${socket.id} has connected`);

  socket.emit("newSession", {
    userID: socket.userID,
    playerID: socket.playerID,
  });

  socket.on("createGame", (name, goToLobby) => {
    // const userID = generateRandomId();
    const userID = socket.userID;
    const playerID = socket.playerID;
    const roomCode = gameStore.createGame();
    // userStore.addRoomCode(userID, roomCode);
    userStore.setPlayerID(userID, playerID);
    gameStore.addNewPlayerToGame(userID, name, playerID, roomCode);
    socket.join(roomCode);
    goToLobby(roomCode);
  });

  socket.on("joinGame", (name, roomCode, goToLobby) => {
    if (gameStore.hasGame(roomCode)) {
      // const userID = generateRandomId();
      const userID = socket.userID;
      const playerID = socket.playerID;
      userStore.setPlayerID(userID, playerID);
      gameStore.addNewPlayerToGame(userID, name, playerID, roomCode);
      socket.join(roomCode);
      socket.broadcast.to(roomCode).emit("playerChange");
      goToLobby(roomCode);
    }
  });

  socket.on("getPlayers", (roomCode, setPlayers) => {
    if (gameStore.hasGame(roomCode)) {
      const players = Array.from(gameStore.getGame(roomCode).players.values());
      setPlayers(players);
      console.log("socket.playerID is", socket.playerID);
      console.log("getPlayers's players is ", JSON.stringify(players, null, 2))
    }
  });

  socket.on("kickPlayer", (roomCode, playerID) => {
    console.log(`kickPlayer(server) has roomCode ${roomCode}, playerID ${playerID}`);

    const userID = userStore.getUserID(playerID);
    console.log("userID in kickPlayer(server) is ", userID);
    userStore.deleteUser(userID);
    console.log("userID in kickPlayer(server) is ", userID);

    gameStore.removePlayerFromGame(userID, roomCode);

    // maybe use io.to(...etc instead of socket.broadcast.to(...etc
    io.to(roomCode).emit("playerKicked", playerID);
  });

  socket.on("leaveRoom", (roomCode) => {
    socket.leave(roomCode);
  });

  socket.on("disconnect", () => {
    console.log(`user ${socket.id} has disconnected`);
    // const roomCode = userStore.getRoomCode(userID);
    // gameStore.deletePlayerFromGame(userID, roomCode);
  });

  // TODO: socket.on("disconnect") -> remove from room and emit "playerChange" event
  //  https://socket.io/docs/v4/server-socket-instance/#disconnect

});

httpServer.listen(80);