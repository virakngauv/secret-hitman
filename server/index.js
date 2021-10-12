import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import { Server } from "socket.io";

import gameStore from "./GameStore.js";
import { generateRandomId } from "./helpers/util/index.js"
import GameService from "./services/GameService.js";
import userStore from "./UserStore.js";

// TODO: make enum for GameState and PlayerStatus
const GameState = {
  LOBBY: "lobby",
  GAME: "game",
  END: "end",
};

const PlayerStatus = {
  ACTIVE: "active", 
  INACTIVE: "inactive", 
  CODEMASTER: "codemaster",
};

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
httpServer.listen(80);

app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./build" });
});

try {
  const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/secrethitman.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/secrethitman.com/fullchain.pem')
  }

  const httpsServer = https.createServer(credentials, app);
  io.attach(httpsServer);
  httpsServer.listen(443);
} catch (e) {
  console.error(`Error: ${e}`);
}

const gameService = new GameService();

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
  // TODO: refactor so that socket.on() call other functions instead of all logic being in index.js

  // TODO: controller should not interact with data access layer at all, should be via the service layer
  console.log(`user ${socket.id} has connected`);

  socket.emit("newSession", {
    userID: socket.userID,
    playerID: socket.playerID,
  });

  socket.on("joinRoom", (roomCode) => {
    if (gameStore.hasGame(roomCode)) {
      socket.join(roomCode);
    }
  })

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

  socket.on("joinGame", (name, roomCode, goToRoom) => {
    if (gameStore.hasGame(roomCode)) {
      // const userID = generateRandomId();
      const userID = socket.userID;
      const playerID = socket.playerID;


      // // TODO: what if existing user joins same game in different tab or
      // if (gameService.checkIfRoomAlreadyHasUser(roomCode, userID)) {
      //   gameService.loadGameDataForUser(roomCode, userID);
      // };
      userStore.setPlayerID(userID, playerID);
      gameStore.addNewPlayerToGame(userID, name, playerID, roomCode);
      socket.join(roomCode);
      socket.broadcast.to(roomCode).emit("playerChange");
      goToRoom();
    }
  });

  socket.on("getGameState", (roomCode, setGameState) => {
    if (gameStore.hasGame(roomCode)) {
      const gameState = gameStore.getGame(roomCode).gameState;
      console.log(`getGameState's gameState is ${gameState}`);
      setGameState(gameState);
    }
  });

  socket.on("getPlayers", (roomCode, setPlayers) => {
    if (gameStore.hasGame(roomCode)) {
      const players = Array.from(gameStore.getGame(roomCode).players.values());
      setPlayers(players);
    }
  });

  socket.on("getIsUserInRoom", (roomCode, setIsUserInRoom) => {
    const userID = socket.userID;
    if (gameStore.hasGame(roomCode)) {
      const players = gameStore.getGame(roomCode).players;
      const isUserInRoom = players.get(userID) ? true : false;
      setIsUserInRoom(isUserInRoom);
    }
  });

  socket.on("getTiles", (roomCode, setTiles) => {
    const userID = socket.userID;
    if (gameStore.hasGame(roomCode) && userID) {
      const game = gameStore.getGame(roomCode);
      const tiles = gameService.getTilesForUser(game, userID);
      
      console.log(`tiles is ${JSON.stringify(tiles, null, 2)}`);

      setTiles(tiles);
    }
  });

  socket.on("claimTile", (roomCode, tileIndex) => {
    const userID = socket.userID;

    if (gameStore.hasGame(roomCode)) {
      const game = gameStore.getGame(roomCode);
      const playerStatus = game.players.get(userID)?.status;
      if (playerStatus === PlayerStatus.ACTIVE) {
        gameService.claimTile(game, userID, tileIndex);

        // TODO: maybe change below to: 
        //   io.to(userID).emit("tileChange", newTiles);
        // if 2x RTT is too slow
        io.to(roomCode).emit("tileChange");
        io.to(roomCode).emit("playerChange");
      }
    }
  })

  socket.on("getHint", (roomCode, setHint) => {
    if (gameStore.hasGame(roomCode)) {
      const hint = gameStore.getGame(roomCode).hint;
      setHint(hint);
    }
  });

  socket.on("submitHint", (roomCode, hint) => {
    const userID = socket.userID;

    if (gameStore.hasGame(roomCode)) {
      const game = gameStore.getGame(roomCode);
      const playerStatus = game.players.get(userID)?.status;
      if (playerStatus === PlayerStatus.CODEMASTER) {
        gameService.setHint(game, hint);

        io.to(roomCode).emit("hintChange");
      }
    }
  })

  socket.on("markPlayerStatus", (roomCode, status) => {
    const game = gameStore.getGame(roomCode);
    if (game && game.gameState === GameState.LOBBY) {
      const userID = socket.userID;
      const player = game.players.get(userID);
      // console.log(`markPlayerStatus's player is ${JSON.stringify(player, null, 2)}`);
      player.status = status === PlayerStatus.ACTIVE ? PlayerStatus.ACTIVE : PlayerStatus.INACTIVE;
      // console.log("inside markPlayerStatus if statement");
      // console.log(`markPlayerStatus's player is nowww ${JSON.stringify(player, null, 2)}`);
      // console.log("markPlayerStatus's players is ", JSON.stringify(Array.from(game.players.values()), null, 2))
      io.to(roomCode).emit("playerChange");
    }
  });

  socket.on("startGame", (roomCode) => {
    // console.log("Inside startGame(server)")
    // console.log(`roomCode is ${roomCode}`);

    const game = gameStore.getGame(roomCode);
    // console.log(`game is ${game}`);
    const isInLobby = game && game.gameState === GameState.LOBBY;
    const allPlayersReady = game && Array.from(game.players.values()).reduce(
      (readyStatusSoFar, currentPlayer) => {
        return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
      }, true);
    // console.log(`isInLobby is ${isInLobby} and allPlayersReady is ${allPlayersReady}`);
    if (isInLobby && allPlayersReady) {
      gameService.initializeGame(roomCode, socket);

      io.to(roomCode).emit("gameStateChange");
    }
  })

  socket.on("kickPlayer", (roomCode, playerID) => {
    console.log(`kickPlayer(server) has roomCode ${roomCode}, playerID ${playerID}`);

    const userID = userStore.getUserID(playerID);
    // console.log("userID in kickPlayer(server) is ", userID);
    userStore.deleteUser(userID);
    // console.log("userID in kickPlayer(server) is ", userID);

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