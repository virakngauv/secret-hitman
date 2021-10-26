import gameStore from "../GameStore.js";
import { shuffledArray } from "../helpers/util/index.js";
import userStore from "../UserStore.js";

// TODO: make enum for GameState, PlayerStatus, TileType, TileState
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

const TileType = {
  TARGET: "target", 
  CIVILIAN: "civilian",
  ASSASSIN: "assassin",
};

const TileState = {
  ENABLED: "enabled",
  DISABLED_OPAQUE: "disabled-opaque",
  DISABLED_TRANSPARENT: "disabled-transparent",
};

const RoundPhase = {
  HINT: "hint",
  GUESS: "guess",
};

const TurnStatus = {
  STARTED: "started",
  PAUSED: "paused",
  ENDED: "ended",
};

class GameService {
  constructor(io) {
    this.io = io;

    this.maxRounds = 2;
    this.totalNumberOfTiles = 12;
    this.numberOfAssassinTiles = 1;
    this.numberOfTargetTiles = 5;
    this.numberOfCivilianTiles = 6;
  }

  initializeGame(roomCode) {
    // console.log(`Inside initializeGame with roomCode: ${roomCode}`);
    const game = gameStore.getGame(roomCode);

    this.updateGameState(roomCode, GameState.GAME);
    this.updateRoundPhase(game, RoundPhase.HINT)
    this.updateTurnStatus(game, TurnStatus.STARTED);
    // Tiles will be active, which is funny if people want to select tiles before the hint is revealed
    // this.markAllPlayersInactive(game);
    this.markAllPlayersCodemaster(roomCode);
    // this.assignNextCodemaster(roomCode);
    this.incrementRoundNumber(game);
    this.incrementTurnNumber(game);
    // this.setupNewTilesForAllPlayers(game);
  }

  resetGame(roomCode) {
      // gameService.markAllPlayersInactive(roomCode);
      // gameService.updateGameState(roomCode, GameState.LOBBY);
    const gameState = this.getGameState(roomCode);
    if (gameState !== GameState.LOBBY) {
      const game = gameStore.getGame(roomCode);

      this.updateGameState(roomCode, GameState.LOBBY);
      this.resetPlayers(roomCode);
      game.currentCodemasterIndex = null;
      game.roundNumber = 0;
      game.hint = "";
    }
  }

  resetPlayers(roomCode) {
    const game = gameStore.getGame(roomCode);
    const players = game.players;

    this.markAllPlayersInactive(roomCode);
    players.forEach((player) => {
      player.oldScore = 0;
      player.newScore = 0;
      player.canSeeBoard = false;
    });
  }

  getGameState(roomCode) {
    const game = gameStore.getGame(roomCode);
    return game.gameState;
  }

  updateGameState(roomCode, gameState) {
    const game = gameStore.getGame(roomCode);
    game.gameState = gameState;
  }

  getRoundPhase(roomCode) {
    const game = gameStore.getGame(roomCode);
    return game.roundPhase;
  }

  updateRoundPhase(game, roundPhase) {
    game.roundPhase = roundPhase;
  }

  startGuessPhase(roomCode) {
    const game = gameStore.getGame(roomCode);
    this.updateTurnStatus(game, TurnStatus.ENDED);
    this.updateRoundPhase(game, RoundPhase.GUESS);
    // this.assignNextCodemaster(roomCode);
    // this.startNextTurn(roomCode);
  }

  updateTurnStatus(game, turnStatus) {
    game.turnStatus = turnStatus;
  }

  markAllPlayersInactive(roomCode) {
    const game = gameStore.getGame(roomCode);
    const players = game.players;
    players.forEach((player) => {
      player.status = PlayerStatus.INACTIVE;
    });
  }

  preparePlayersForNextTurn(game) {
    const players = game.players;
    players.forEach((player) => {
      player.status = PlayerStatus.ACTIVE;
      player.oldScore += player.newScore;
      player.newScore = 0;
      player.canSeeBoard = false;
    });
  }

  assignNextCodemaster(roomCode) {
    const game = gameStore.getGame(roomCode);
    const currentCodemasterIndex = game.currentCodemasterIndex;
    const players = game.players;
    const playerArchive = game.playerArchive;
    
    let nextCodemasterIndex = currentCodemasterIndex === null ? 0 : currentCodemasterIndex + 1

    while (nextCodemasterIndex !== currentCodemasterIndex) {
      if (nextCodemasterIndex === playerArchive.length) {
        this.incrementRoundNumber(game);
        // TODO: make function for starting next hint phase
        nextCodemasterIndex = 0;
      }

      if (game.roundNumber > this.maxRounds) {
        this.updateGameState(roomCode, GameState.END);
        return;
      }

      const nextPossibleCodemasterID = playerArchive[nextCodemasterIndex];
      const nextPossibleCodemaster = players.get(nextPossibleCodemasterID);
      
      if (nextPossibleCodemaster) {
        nextPossibleCodemaster.status = PlayerStatus.CODEMASTER;
        nextPossibleCodemaster.canSeeBoard = true;
        game.currentCodemasterIndex = nextCodemasterIndex;
        game.currentCodemasterID = nextPossibleCodemasterID;
        this.incrementTurnNumber(game);
        break;
      }

      nextCodemasterIndex = nextCodemasterIndex + 1;
    }
  }

  incrementRoundNumber(game) {
    game.roundNumber += 1;
  }

  incrementTurnNumber(game) {
    game.turnNumber += 1;
  }

  setupNewTiles(game) {
    const tiles = [];
    tiles.push(...this.getTilesOfType(this.numberOfAssassinTiles, TileType.ASSASSIN));
    tiles.push(...this.getTilesOfType(this.numberOfTargetTiles, TileType.TARGET));
    tiles.push(...this.getTilesOfType(this.numberOfCivilianTiles, TileType.CIVILIAN));

    for (let i = 0; i < tiles.length; i++) {
      tiles[i].word = this.getNextDictionaryWord(game);
    }

    return shuffledArray(tiles);
  }

  setupNewTilesForAllPlayers(game) {
    const players = game.players;
    players.forEach((player) => {
      player.tiles = this.setupNewTiles(game);
    })
  }

  getNextDictionaryWord(game) {
    const nextDictionaryWord = game.dictionary.shift();

    if (game.dictionary.length === 0) {
      game.dictionary = shuffledArray(game.nextDictionary);
      game.nextDictionary = [nextDictionaryWord];
    } else {
      game.nextDictionary.push(nextDictionaryWord);
    }

    return nextDictionaryWord
  }

  getTilesOfType(number, type) {
    return Array.from({ length: number }, () => ({
      word: null,
      type,
      claimers: [],
      claimerIDs: [],
      state: null,
    }));
  }

  getTilesForUser(roomCode, userID) {
    // const tiles = [...game.tiles]; 
    const game = gameStore.getGame(roomCode);

    const roundPhase = game.roundPhase;
    if (roundPhase === RoundPhase.HINT) {
      const playerTilesCopy = game.players.get(userID).tiles.map(tile => {return {...tile}});
      playerTilesCopy.forEach((tile) => {
        delete tile.claimerIDs;
        tile.state = TileState.DISABLED_OPAQUE;
      });

      return playerTilesCopy;
    }

    const currentCodemasterID = game.currentCodemasterID;
    const currentCodemaster = game.players.get(currentCodemasterID);
    const tilesCopy = currentCodemaster.tiles.map(tile => {return {...tile}});
    const playerID = userStore.getPlayerID(userID);
    const playerStatus = this.getPlayerStatus(game, playerID);
    const playerCanSeeBoard = this.getPlayerCanSeeBoard(roomCode, userID);
    const turnStatus = game.turnStatus;
    if (playerStatus === PlayerStatus.CODEMASTER || playerCanSeeBoard) {
      tilesCopy.forEach((tile) => {
        delete tile.claimerIDs;
        tile.state = TileState.DISABLED_OPAQUE;
      });

      return tilesCopy;
    }

    tilesCopy.forEach((tile) => {
      const tileType = tile.type;
      const claimerIDs = tile.claimerIDs;
      delete tile.claimerIDs;

      if (claimerIDs.includes(playerID)) {
        tile.state = TileState.DISABLED_OPAQUE;
      } else if (claimerIDs.length === 0) {
        tile.type = null;

        if (playerStatus === PlayerStatus.ACTIVE) {
          tile.state = TileState.ENABLED;
        } else if (playerStatus === PlayerStatus.INACTIVE) {
          tile.state = TileState.DISABLED_TRANSPARENT;
        } else {
          // Should not be reachable
          console.warn(`Possible Error: playerStatus is ${playerStatus}`);
        }
      } else {
        // Else branch reached if claimed by another player:

















        
        if (tileType === TileType.ASSASSIN ) {
          tile.claimers = [];
          tile.type = null;
          tile.state = playerStatus === PlayerStatus.ACTIVE ? TileState.ENABLED : TileState.DISABLED_TRANSPARENT;
        } else {
          tile.state = TileState.DISABLED_TRANSPARENT
        }
      }
    });

    if (turnStatus === TurnStatus.PAUSED) {
      tilesCopy.forEach((tile) => {
        const tileState = tile.state;
        if (tileState === TileState.ENABLED) {
          tile.state = TileState.DISABLED_TRANSPARENT;
        }
      })
    }

    return tilesCopy;
  }

  getMessagesForUser(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const codemaster = game.players.get(game.currentCodemasterID);
    const player = game.players.get(userID);
    const roundPhase = game.roundPhase;
    const turnStatus = game.turnStatus;
    // const hint = roundPhase === RoundPhase.HINT ? 
    const hint = (() => {
      if (roundPhase === RoundPhase.HINT) {
        return player.hint;
      } else if (roundPhase === RoundPhase.GUESS) {
        return codemaster.hint;
      }
    })();

    const players = game.players;
    const playerStatus = player.status;
    const playerCanSeeBoard = player.canSeeBoard;
    const allPlayersReady = Array.from(players.values()).reduce(
      (readyStatusSoFar, currentPlayer) => {
        return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
      }, true
    );

    const isLastTurn = this.isLastTurn(game);

    let headerMessage = "";
    let footerMessage = "";

    if (roundPhase === RoundPhase.HINT && hint === "") {
      // headerMessage = playerStatus === PlayerStatus.CODEMASTER ? "type your hint below" : "hint pending..";
      headerMessage = "type your hint below";
    } 
    // else if (turnStatus === TurnStatus.PAUSED) {
    //   headerMessage = "hint marked as invalid, pending codemaster..";
    // } 
    else if (roundPhase === RoundPhase.GUESS && turnStatus === TurnStatus.ENDED) {
      headerMessage = isLastTurn ? "last turn ended" : "turn ended";

      if (!playerCanSeeBoard) {
        // TODO automatically show board on turn end
        footerMessage = "Reveal Tiles?";
      } else if (playerStatus === PlayerStatus.INACTIVE) {
        footerMessage = isLastTurn ? "Ready?" : "Ready for Next Turn?";
      } else if (isLastTurn) {
        // If last turn, skips the "waiting on other players" message
        footerMessage = "See Rankings?";
      } else if (!allPlayersReady) {
        footerMessage = "Waiting on Other Players";
      } else {
        footerMessage = "Start Next Turn?";
      }
    } 

    return [headerMessage, footerMessage];
  }

  isLastTurn(game) {
    const isLastRound = game.roundNumber === this.maxRounds;
    console.log(`game.roundNumber is ${game.roundNumber} and this.maxRound is ${this.maxRounds}`);

    const lastPlayerID = Array.from(game.players.keys()).pop();
    const codemasterID = game.playerArchive[game.currentCodemasterIndex];
    const lastPlayerIsCodemaster = lastPlayerID === codemasterID;
    console.log(`lastPlayerID is ${lastPlayerID} and codemasterID is ${codemasterID}`);

    return isLastRound && lastPlayerIsCodemaster;
  }

  getHint(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const roundPhase = game.roundPhase;
    // console.log(`players is: ${JSON.stringify(Array.from(game.players.values()), null, 2)}`);

    if (roundPhase === RoundPhase.HINT) {
      const player = game.players.get(userID);
      return player.hint;
    } else if (roundPhase === RoundPhase.GUESS) {
      const currentCodemaster = game.players.get(game.currentCodemasterID);
      return currentCodemaster.hint;
    } else {
      console.warn(`Possible Error: Should not be asking for hint when RoundPhase is not Hint or Guess`);
      return "";
    }
  }

  // setHint(game, hint) {
  //   game.hint = hint;
  // }

  setHintForPlayer(roomCode, hint, userID) {
    const game = gameStore.getGame(roomCode);
    const player = game.players.get(userID);
    player.hint = hint;
  }

  // TODO: rename to pauseTurn()
  invalidateHint(game) {
    game.turnStatus = TurnStatus.PAUSED;
  }

  // resetHint(game) {
  //   // TODO: make constant for default hint for use here and on init
  //   const hint = "";
  //   this.setHint(game, hint);
  // }

  getRoundInfo(roomCode) {
    const game = gameStore.getGame(roomCode);
    const currentRoundNumber = game.roundNumber;
    const maxRoundNumber = this.maxRounds;
    const roundInfo = [currentRoundNumber, maxRoundNumber];

    return roundInfo;
  }

  getPlayers(roomCode) {
    const game = gameStore.getGame(roomCode);
    const players = game.players;

    return Array.from(players.values());
  }

  getPlayerStatus(game, playerID) {
    const userID = userStore.getUserID(playerID);
    const player = game.players.get(userID);
    if (player) {
      return player.status;
    }
  }

  markPlayerStatus(roomCode, userID, playerStatus) {
    const game = gameStore.getGame(roomCode);
    const player = game.players.get(userID);
    player.status = playerStatus;

    // if (playerStatus === PlayerStatus.INACTIVE) {
    //   this.endPlayerTurn(roomCode, userID);
    // }

    // console.log(`GameService's markPlayerStatus's player is ${JSON.stringify(player, null, 2)} and playerStatus is ${playerStatus}`);
  }

  markAllPlayersCodemaster(roomCode) {
    const game = gameStore.getGame(roomCode);
    const players = game.players;
    players.forEach((player, userID) => {
      this.markPlayerStatus(roomCode, userID, PlayerStatus.CODEMASTER);
      this.markPlayerCanSeeBoard(roomCode, userID);
    })
  }

  getPlayerCanSeeBoard(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const player = game.players.get(userID);
    
    return player.canSeeBoard;
  }

  markPlayerCanSeeBoard(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const player = game.players.get(userID);
    player.canSeeBoard = true;
  }

  checkAndEndTurnIfTurnShouldEnd(roomCode) {
    // this.markPlayerStatus(roomCode, userID, PlayerStatus.INACTIVE);

    const game = gameStore.getGame(roomCode);

    const players = game.players;
    const noPlayersActive = Array.from(players.values()).reduce(
      (readyStatusSoFar, currentPlayer) => {
        return readyStatusSoFar && currentPlayer.status !== PlayerStatus.ACTIVE
      }, true);
    
    if (noPlayersActive) {
      this.endTurn(roomCode);
    }
  }

  // checkIfTurnShouldEnd(game) {
  //   // const players = game.players;
  //   // const noPlayersActive = Array.from(players.values()).reduce(
  //   //   (readyStatusSoFar, currentPlayer) => {
  //   //     return readyStatusSoFar && currentPlayer.status !== PlayerStatus.ACTIVE
  //   //   }, true);
  //   // return noPlayersActive;
  // }

  endTurn(roomCode) {
    const game = gameStore.getGame(roomCode);

    game.turnStatus = TurnStatus.ENDED;
    this.markAllPlayersInactive(roomCode);

    this.io.to(roomCode).emit("turnStatusChange");
    this.io.to(roomCode).emit("playerChange");
    this.io.to(roomCode).emit("timerTimeChange", null);
    clearInterval(game.timerID);
  }

  checkIfTurnIsEnded(roomCode) {
    const game = gameStore.getGame(roomCode);
    return game.turnStatus === TurnStatus.ENDED;
  }

  incrementCodemasterScore(game, scoreChange) {
    const codemasterIndex = game.currentCodemasterIndex;
    const userID = game.playerArchive[codemasterIndex];
    const codemaster = game.players.get(userID);

    // console.log(`codemasterIndex is ${codemasterIndex}`);
    // console.log(`userID is ${userID}`);
    // console.log(`codemaster is ${codemaster}`);

    // Checking to see if codemaster is still in the game (possibly kicked)
    if (codemaster) {
      codemaster.newScore += scoreChange;
    }
  }

  incrementUserScore(game, scoreChange, userID) {
    const player = game.players.get(userID);
    player.newScore += scoreChange;
  }

  claimTile(roomCode, userID, tileIndex) {
    const game = gameStore.getGame(roomCode);
    const codemaster = game.players.get(game.currentCodemasterID);
    const tile = codemaster.tiles[tileIndex];
    const playerName = game.players.get(userID).name;
    const playerStatus = game.players.get(userID).status;
    const playerID = userStore.getPlayerID(userID);

    // turn is started ||
    // tile is assassin

    const turnIsNotStarted = game.turnStatus !== TurnStatus.STARTED;
    const playerIsNotActive = playerStatus !== PlayerStatus.ACTIVE;
    if (turnIsNotStarted || playerIsNotActive) {
      return;
    }

    if (tile.type === TileType.ASSASSIN) {
        tile.claimers.push(playerName);
        tile.claimerIDs.push(playerID);

        this.incrementCodemasterScore(game, -1);
        this.incrementUserScore(game, -1, userID);
        this.markPlayerStatus(roomCode, userID, PlayerStatus.INACTIVE);
    }

    if (tile.claimers.length === 0) {
      tile.claimers.push(playerName);
      tile.claimerIDs.push(playerID);

      switch (tile.type) {
        case TileType.TARGET:
          this.incrementCodemasterScore(game, 1);
          this.incrementUserScore(game, 1, userID);
          break;
        case TileType.CIVILIAN:
          this.markPlayerStatus(roomCode, userID, PlayerStatus.INACTIVE);
          break;
        default:
          console.warn(`Tile Type was not assassin, target, or civilian`);
      }
    }
  }

  getTurnStatus(roomCode) {
    const game = gameStore.getGame(roomCode);
    const turnStatus = game.turnStatus;

    return turnStatus;
  }

  startNextTurn(roomCode) {
    const game = gameStore.getGame(roomCode);
    const turnStatus = game.turnStatus;

    if (turnStatus === TurnStatus.ENDED) {
      this.preparePlayersForNextTurn(game);
      this.assignNextCodemaster(roomCode);
      // this.resetHint(game);
      // this.setupNewTiles(game);
      this.updateTurnStatus(game, TurnStatus.STARTED);


      if (game.gameState === GameState.GAME) {
        // TODO: remove magic number
        const totalTime = 25000;
        this.startTimer(roomCode, totalTime, () => this.endTurn(roomCode), `GameService's startNextTurn`);
      }

      this.io.to(roomCode).emit("gameStateChange");
      this.io.to(roomCode).emit("roundInfoChange");
      this.io.to(roomCode).emit("roundPhaseChange");
      this.io.to(roomCode).emit("turnStatusChange");
      this.io.to(roomCode).emit("playerChange");
      this.io.to(roomCode).emit("messagesChange");
      this.io.to(roomCode).emit("hintChange");
      this.io.to(roomCode).emit("tileChange");
      this.io.to(roomCode).emit("canSeeBoardChange");
    }
  }

  resetTurn(roomCode) {
    const game = gameStore.getGame(roomCode);

    game.turnStatus = TurnStatus.STARTED;
    game.players.forEach((player) => { 
      player.newScore = 0;
      if (player.status === PlayerStatus.INACTIVE) {
        player.status = PlayerStatus.ACTIVE;
      }
    });
    game.hint = "";
    this.setupNewTiles(game);
  }

  unpauseTurn(roomCode) {
    const game = gameStore.getGame(roomCode);
    game.turnStatus = TurnStatus.STARTED;
  }

  isValidRoomAndUser(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const player = game && game.players.get(userID);
    
    return player ? true : false;
  }

  isValidRoomAndCodemaster(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const player = game && game.players.get(userID);
    const playerStatus = player && player.status;

    if (playerStatus === PlayerStatus.CODEMASTER) {
      return true;
    } else {
      return false;
    }
  }

  addNewPlayerToGame(userID, name, playerID, roomCode) {
    const game = gameStore.getGame(roomCode);
    // const gameState = game.gameState;
    const roundPhase = game.roundPhase;
    const turnStatus = game.turnStatus;
    // const playerStatus = gameState === GameState.GAME && turnStatus !== TurnStatus.ENDED ? PlayerStatus.ACTIVE : PlayerStatus.INACTIVE;
    const playerStatus = (() => {
      if (roundPhase === RoundPhase.HINT) {
        return PlayerStatus.CODEMASTER;
      } else if (roundPhase === RoundPhase.GUESS && turnStatus !== TurnStatus.ENDED) {
        return PlayerStatus.ACTIVE;
      } else {
        return PlayerStatus.INACTIVE;
      }
    })();
    const playerCanSeeBoard = turnStatus === TurnStatus.ENDED ? true : false;

    const player = {
      name,
      id: playerID,
      status: playerStatus,
      oldScore: 0,
      newScore: 0,
      hint: "",
      tiles: this.setupNewTiles(game),
      canSeeBoard: playerCanSeeBoard,
    };

    game.players.set(userID, player);
    game.playerArchive.push(userID);
  }

  kickPlayer(roomCode, playerIDToKick) {
    const game = gameStore.getGame(roomCode);
    const userID = userStore.getUserID(playerIDToKick);

    if (this.isValidRoomAndUser(roomCode, userID)) {
      userStore.deleteUser(userID);
      // gameStore.removePlayerFromGame(userID, roomCode);
  
      game.players.delete(userID);
      // console.log(`game.players is ${JSON.stringify(Array.from(game.players.values()), null, 2)}`)
  
      // if (this.games.has(roomCode)) {
      //   this.games.get(roomCode).players.delete(userID);
      // }
    }
  }

  startTimer(roomCode, totalTime, functionToExecute, originForConsoleLog) {
    console.log(`starting timer from ${originForConsoleLog}`);
    const game = gameStore.getGame(roomCode);
    const timerTimeChangeEmitter = (time) => this.io.to(roomCode).volatile.emit("timerTimeChange", time);

    let time = totalTime;
    const timerID = setInterval(() => {
      console.log(`message from ${originForConsoleLog}`);
      if (time > 0) {
        timerTimeChangeEmitter(time);
      } else if (time <= 0) {
        timerTimeChangeEmitter(0);
        console.log(`time is less than 0: ${time}`);
      } if (time <= -1000) {
        console.log(`time is less than or equal to 1000: ${time}`);
        // Always provide a 1 second buffer before executing the desired function
        functionToExecute();
        clearInterval(timerID);
        this.io.to(roomCode).emit("timerTimeChange", null);
      }

      time -= 1000;
    }, 1000);

    console.log(`curious about what the timer object looks like. timerID is ${timerID}`);

    game.timerID = timerID;
  }
}

export default GameService;
