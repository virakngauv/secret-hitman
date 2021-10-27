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

const RoundPhase = {
  HINT: "hint",
  GUESS: "guess",
};

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);
httpServer.listen(80);

// app.use(express.static("./build"));
// app.get("*", (req, res, next) => {
//   res.sendFile("index.html", { root: "./build" });
//   next();
// });

try {
  const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/secrethitman.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/secrethitman.com/fullchain.pem')
  }

  const httpsServer = https.createServer(credentials, app);
  io.attach(httpsServer);
  httpsServer.listen(443);

  // If https server exists, force its usage
  app.use((req, res, next) => {
    // console.log(`Inside https force TKTK "!req.secure" is ${!req.secure}`);
    if (!req.secure) {
      // console.log(`Inside if-block from https force TKTK`);
      res.redirect("https://" + req.headers.host + req.url);
    }

    next();
  })
} catch (e) {
  console.error(`Error: ${e}`);
}

// Look for any static files (css and the like) and if they can't be found, serve index.html
app.use(express.static("./build"));
app.get("*", (req, res) => {
  res.sendFile("index.html", { root: "./build" });
  // next();
});

const gameService = new GameService(io);

io.use((socket, next) => {
  const userID = socket.handshake.auth.userID;
  const playerID = socket.handshake.auth.playerID;
  const roomCode = socket.handshake.auth.roomCode;

  if (userID && playerID) {
    console.log("(server) userID is ", userID);
    console.log("(server) playerID is ", playerID);
    socket.userID = userID;
    socket.playerID = playerID;

    if (roomCode) {
      console.log("(server) roomCode is ", roomCode);
      socket.roomCode = roomCode;
    }

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
      socket.roomCode = roomCode;
    }
  })

  socket.on("createGame", (name, goToLobby) => {
    // const userID = generateRandomId();
    const userID = socket.userID;
    const playerID = socket.playerID;
    const roomCode = gameStore.createGame();
    // userStore.addRoomCode(userID, roomCode);
    userStore.setPlayerID(userID, playerID);
    gameService.addNewPlayerToGame(userID, name, playerID, roomCode);
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
      gameService.addNewPlayerToGame(userID, name, playerID, roomCode);
      socket.join(roomCode);
      socket.broadcast.to(roomCode).emit("playerChange");
      goToRoom();
    }
  });

  socket.on("getGameState", (roomCode, setGameState) => {
    if (gameStore.hasGame(roomCode)) {
      const gameState = gameStore.getGame(roomCode).gameState;
      // console.log(`getGameState's gameState is ${gameState}`);
      setGameState(gameState);
    }
  });

  socket.on("getRoundInfo", (setRoundInfo) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const roundInfo = gameService.getRoundInfo(roomCode);
      setRoundInfo(roundInfo);
    }
  })

  socket.on("getPlayers", (setPlayers) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const players = gameService.getPlayers(roomCode);
      setPlayers(players);
    }

    // if (gameStore.hasGame(roomCode)) {
    //   const players = Array.from(gameStore.getGame(roomCode).players.values());
    //   setPlayers(players);
    // }
  });

  socket.on("getIsUserInRoom", (roomCode, setIsUserInRoom) => {
    const userID = socket.userID;
    if (gameStore.hasGame(roomCode)) {
      const players = gameStore.getGame(roomCode).players;
      const isUserInRoom = players.get(userID) ? true : false;
      setIsUserInRoom(isUserInRoom);
    }
  });

  socket.on("getTiles", (setTiles) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const tiles = gameService.getTilesForUser(roomCode, userID);
      
      // console.log(`tiles is ${JSON.stringify(tiles, null, 2)}`);

      setTiles(tiles);
    }
  });

  socket.on("claimTile", (tileIndex) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      gameService.claimTile(roomCode, userID, tileIndex);

      

      // TODO: if 2x RTT is too slow maybe change below to: 
      //   io.to(userID).emit("tileChange", newTiles);
      io.to(roomCode).emit("tileChange");
      io.to(roomCode).emit("playerChange");



      // check to see if turn should end
      gameService.checkAndEndTurnIfTurnShouldEnd(roomCode);







      // TODO: bug
      // undesirable effect, when turn ends b/c last player clicks on a tile
      //   then the screen doesn't properly go to how I want the end screen to look like
      const turnIsEnded = gameService.checkIfTurnIsEnded(roomCode);
      if (turnIsEnded) {
        io.to(roomCode).emit("roundPhaseChange");
        io.to(roomCode).emit("turnStatusChange");
        // io.to(roomCode).emit("tileChange");
        // io.to(roomCode).emit("playerChange");
        io.to(roomCode).emit("messagesChange");
        io.to(roomCode).emit("hintChange");
      }
    }
  });

  socket.on("revealBoard", (setTiles) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const turnIsEnded = gameService.checkIfTurnIsEnded(roomCode);

      console.log(`revealBoard's turnIsEnded is ${turnIsEnded}`);

      if (turnIsEnded) {
        gameService.markPlayerCanSeeBoard(roomCode, userID);
        const tiles = gameService.getTilesForUser(roomCode, userID);
        setTiles(tiles)
      }
    }
  });

  socket.on("getMessages", (setMessages) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const messages = gameService.getMessagesForUser(roomCode, userID);
      setMessages(messages);
    }
  })

  socket.on("getHint", (setHint) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const hint = gameService.getHint(roomCode, userID);
      setHint(hint);
    }
  });

  socket.on("submitHint", (hint) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndCodemaster(roomCode, userID)) {
      console.log(`submithint's hint is ${hint}`);
      gameService.setHintForPlayer(roomCode, hint, userID);
      

      const roundPhase = gameService.getRoundPhase(roomCode);
      if (roundPhase === RoundPhase.HINT) {
        gameService.markPlayerStatus(roomCode, userID, PlayerStatus.ACTIVE);
      } else if (roundPhase === RoundPhase.GUESS) {
      }

      io.to(roomCode).emit("messagesChange");
      io.to(roomCode).emit("hintChange");
    }
    // if (gameStore.hasGame(roomCode)) {
    //   const game = gameStore.getGame(roomCode);
    //   const playerStatus = game.players.get(userID)?.status;
    //   if (playerStatus === PlayerStatus.CODEMASTER) {
    //     gameService.setHint(game, hint);

    //     io.to(roomCode).emit("messagesChange");
    //     io.to(roomCode).emit("hintChange");
    //   }
    // }
  });

  socket.on("invalidateHint", () => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameStore.hasGame(roomCode)) {
      const game = gameStore.getGame(roomCode);
      const player = game.players.get(userID);
      if (player) {
        // TODO: rewrite to markHintAsInvalid
        gameService.invalidateHint(game);












        // TODO: getHint listener should check turn status

        io.to(roomCode).emit("turnStatusChange");
        io.to(roomCode).emit("messagesChange");
        io.to(roomCode).emit("tileChange");
      }
    }
  });

  socket.on("discardHint", () => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndCodemaster(roomCode, userID)) {
      gameService.resetTurn(roomCode);

      io.to(roomCode).emit("turnStatusChange");
      io.to(roomCode).emit("playerChange");
      io.to(roomCode).emit("messagesChange");
      io.to(roomCode).emit("hintChange");
      io.to(roomCode).emit("tileChange");
    }
  });

  socket.on("keepHint", () => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndCodemaster(roomCode, userID)) {
      gameService.unpauseTurn(roomCode);

      io.to(roomCode).emit("turnStatusChange");
      io.to(roomCode).emit("messagesChange");
      io.to(roomCode).emit("hintChange");
      io.to(roomCode).emit("tileChange");
    }
  });

  socket.on("getRoundPhase", (setRoundPhase) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const roundPhase = gameService.getRoundPhase(roomCode);
      setRoundPhase(roundPhase);
    }
  })

  socket.on("getTurnStatus", (setTurnStatus) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const turnStatus = gameService.getTurnStatus(roomCode);
      setTurnStatus(turnStatus);
    }
  });

  socket.on("startNextTurn", () => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const timerID = gameService.getTimerID(roomCode);
      if (!timerID) {
        gameService.startTimer(roomCode, 5000, () => gameService.startNextTurn(roomCode), `socket.on("startNextTurn)`);
        io.to(roomCode).emit("messagesChange");
      }
      // gameService.startNextTurn(roomCode);

      // io.to(roomCode).emit("gameStateChange");
      // io.to(roomCode).emit("roundInfoChange");
      // io.to(roomCode).emit("roundPhaseChange");
      // io.to(roomCode).emit("turnStatusChange");
      // io.to(roomCode).emit("playerChange");
      // io.to(roomCode).emit("messagesChange");
      // io.to(roomCode).emit("hintChange");
      // io.to(roomCode).emit("tileChange");
      // io.to(roomCode).emit("canSeeBoardChange");
    }
  });

  socket.on("markPlayerStatus", (status) => {
    //   const game = gameStore.getGame(roomCode);
    //   if (game && game.gameState === GameState.LOBBY) {
    //     const userID = socket.userID;
    //     const player = game.players.get(userID);
    //     // console.log(`markPlayerStatus's player is ${JSON.stringify(player, null, 2)}`);
    //     player.status = status === PlayerStatus.ACTIVE ? PlayerStatus.ACTIVE : PlayerStatus.INACTIVE;
    //     // console.log("inside markPlayerStatus if statement");
    //     // console.log(`markPlayerStatus's player is nowww ${JSON.stringify(player, null, 2)}`);
    //     // console.log("markPlayerStatus's players is ", JSON.stringify(Array.from(game.players.values()), null, 2))
    //     io.to(roomCode).emit("playerChange");
    //   }
    // });
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    // console.log(`markPlayerStatus's roomCode is ${roomCode} and userID is ${userID}`);

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      gameService.markPlayerStatus(roomCode, userID, status);

      io.to(roomCode).emit("playerChange");
      io.to(roomCode).emit("messagesChange");
    }
    // // START TEMP CODE
    // const players = gameStore.getGame(roomCode).players.values();
    // // console.log(`markPlayerStatus's players is ${JSON.stringify(players, null, 2)}`);
    // // END TEMP CODE
  });

  // socket.on("getPlayerCanSeeBoard", (setPlayerCanSeeBoard) => {
  //   const roomCode = socket.roomCode;
  //   const userID = socket.userID;

  //   if (gameService.isValidRoomAndUser(roomCode, userID)) {
  //     const playerCanSeeBoard = gameService.getPlayerCanSeeBoard(roomCode, userID);
  //     setPlayerCanSeeBoard(playerCanSeeBoard);
  //   }
  // });

  socket.on("getTimerTime", (setTimerTime) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const timerTime = gameService.getTimerTime(roomCode);
      setTimerTime(timerTime);
    }
  });

  socket.on("getTimerID", (setTimerID) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      const timerID = gameService.getTimerID(roomCode);
      // console.log(`stringified timerID is: ${JSON.stringify(timerID, null, 2)}`);
      setTimerID(timerID);
    }
  });

  socket.on("endPlayerTurn", (setTiles) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      // gameService.endPlayerTurn(roomCode, userID);
      gameService.markPlayerStatus(roomCode, userID, PlayerStatus.INACTIVE);

      gameService.checkAndEndTurnIfTurnShouldEnd(roomCode);

      const tiles = gameService.getTilesForUser(roomCode, userID);
      setTiles(tiles);

      io.to(roomCode).emit("roundPhaseChange");
      io.to(roomCode).emit("turnStatusChange");
      io.to(roomCode).emit("playerChange");
      io.to(roomCode).emit("messagesChange");
      io.to(roomCode).emit("hintChange");
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
      }, true
    );
    // console.log(`isInLobby is ${isInLobby} and allPlayersReady is ${allPlayersReady}`);
    if (isInLobby && allPlayersReady) {
      gameService.initializeGame(roomCode);
      
      // TODO: remove magic number
      const totalTime = 15000;
      // const totalTime = 90000;
      // const timerTimeChangeEmitter = (time) => io.to(roomCode).volatile.emit("timerTimeChange", time);
      const startGuessPhase = () => {
        gameService.startGuessPhase(roomCode);
        gameService.startNextTurn(roomCode);

        // io.to(roomCode).emit("gameStateChange");
        // io.to(roomCode).emit("roundInfoChange");
        // io.to(roomCode).emit("roundPhaseChange");
        // io.to(roomCode).emit("turnStatusChange");
        // io.to(roomCode).emit("playerChange");
        // io.to(roomCode).emit("messagesChange");
        // io.to(roomCode).emit("hintChange");
        // io.to(roomCode).emit("tileChange");
        // io.to(roomCode).emit("canSeeBoardChange");
        // io.to(roomCode).emit("timerTimeChange", null);
      };

      gameService.startTimer(roomCode, totalTime, () => gameService.endTurn(roomCode), `socket.on("startGame")`);
      io.to(roomCode).emit("gameStateChange");
    }
  });

  socket.on("playAgain", (setGameState) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      gameService.resetGame(roomCode);
      setGameState(GameState.LOBBY);


      // const gameState = gameService.getGameState(roomCode);
       

      // gameService.markAllPlayersInactive(roomCode);
      // gameService.updateGameState(roomCode, GameState.LOBBY);
      
      // // set to game state to lobby
      // // force local game state to lobby
    }
  })

  socket.on("kickPlayer", (playerIDToKick) => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;
    // console.log(`kickPlayer(server) has roomCode ${roomCode}, playerIDToKick ${playerIDToKick}`);

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      gameService.kickPlayer(roomCode, playerIDToKick);
      gameService.checkAndEndTurnIfTurnShouldEnd(roomCode);

      // TODO: see what events are required now that kicking is only possible in the lobby
      // TODO: check to see if event listener is still registered if a player joins mid-game (I think event listener is set on lobby screen which will have been skipped)
      io.to(roomCode).emit("playerKicked", playerIDToKick);
      io.to(roomCode).emit("turnStatusChange");
      io.to(roomCode).emit("playerChange");
      io.to(roomCode).emit("messagesChange");
      io.to(roomCode).emit("hintChange");
    }
  });

  socket.on("pauseTimer", () => {
    const roomCode = socket.roomCode;
    const userID = socket.userID;

    if (gameService.isValidRoomAndUser(roomCode, userID)) {
      gameService.pauseGameTimer(roomCode);
    }
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
