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

const TurnStatus = {
  STARTED: "started",
  PAUSED: "paused",
  ENDED: "ended",
}

class GameService {
  constructor() {
    this.maxRounds = 3;
    this.totalNumberOfTiles = 12;
  }

  initializeGame(roomCode, socket) {
    console.log(`Inside initializeGame with roomCode: ${roomCode}`);

    // TODO: init game
    /*
      gamestate: game
      players: codemaster assigned, others made inactive
      tiles: pull from dictionary, assign types

    */
    const game = gameStore.getGame(roomCode);

    this.updateGameState(game, GameState.GAME);
    this.updateTurnStatus(game, TurnStatus.STARTED);
    // Tiles will be active, which is funny if people want to select tiles before the hint is revealed
    // this.markAllPlayersInactive(game);
    this.assignNextCodemaster(game, socket);
    this.setupNewTiles(game);
  }

  updateGameState(game, gameState) {
    game.gameState = gameState;
  }

  updateTurnStatus(game, turnStatus) {
    game.turnStatus = turnStatus;
  }

  markAllPlayersInactive(game) {
    const players = game.players;
    players.forEach((player) => {
      player.status = PlayerStatus.INACTIVE;
    });
  }

  assignNextCodemaster(game, socket) {
    const currentCodemasterIndex = game.currentCodemasterIndex;
    const players = game.players;
    const playerArchive = game.playerArchive;
    const roundNumber = game.roundNumber;
    
    let nextCodemasterIndex = currentCodemasterIndex === null ? 0 : currentCodemasterIndex + 1
    while (nextCodemasterIndex < playerArchive.length) {
      const nextPossibleCodemaster = players.get(playerArchive[nextCodemasterIndex]);
      
      if (nextPossibleCodemaster) {
        nextPossibleCodemaster.status = PlayerStatus.CODEMASTER;
        nextPossibleCodemaster.canSeeBoard = true;
        game.currentCodemasterIndex = nextCodemasterIndex;
        break;
      }

      nextCodemasterIndex = nextCodemasterIndex + 1;
    }

    if (nextCodemasterIndex === playerArchive.length) {
      game.roundNumber = roundNumber + 1;
      game.currentCodemasterIndex = 0;
    }

    if (game.roundNumber > this.maxRounds) {
      this.updateGameState(game, GameState.END);
      socket.emit("gameEnd");
    }
  }

  setupNewTiles(game) {
    game.tiles = [];
    game.tiles.push(...this.getTilesOfType(1, TileType.ASSASSIN));
    game.tiles.push(...this.getTilesOfType(5, TileType.TARGET));
    game.tiles.push(...this.getTilesOfType(6, TileType.CIVILIAN));

    for (let i = 0; i < game.tiles.length; i++) {
      game.tiles[i].word = this.getNextDictionaryWord(game);
    }

    console.log(JSON.stringify(game.tiles, null, 2));

    game.tiles = shuffledArray(game.tiles);
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
    const tilesCopy = game.tiles.map(tile => {return {...tile}});
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

      // switch (claimerID) {
      //   case playerID:
      //     tile.state = TileState.DISABLED_OPAQUE;
      //     break;
      //   case null:
      //     tile.type = null;

      //     if (playerStatus === PlayerStatus.ACTIVE) {
      //       tile.state = TileState.ENABLED;
      //     } else if (playerStatus === PlayerStatus.INACTIVE) {
      //       tile.state = TileState.DISABLED_TRANSPARENT;
      //     } else {
      //       // Should not be reachable
      //       console.warn(`Possible Error: playerStatus is ${playerStatus}`);
      //     }
      //     break;
      //   // Default case reached if claimed by another player:
      //   default:
      //     if (tileType === TileType.ASSASSIN && playerStatus === PlayerStatus.ACTIVE) {
      //       tile.claimer = null;
      //       tile.type = null;
      //       tile.state = TileState.ENABLED;
      //     } else {
      //       tile.state = TileState.DISABLED_TRANSPARENT
      //     }
      // }
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

  getHint(roomCode) {
    const game = gameStore.getGame(roomCode);
    const turnStatus = game.turnStatus;

    if (turnStatus === TurnStatus.PAUSED) {
      const turnPausedMessage = "hint marked as invalid, pending codemaster..";
      return turnPausedMessage
    } else if (turnStatus === TurnStatus.ENDED) {
      const turnEndedMessage = `turn ended, hint: ${game.hint}`;
      return turnEndedMessage;
    } else {
      return game.hint;
    }
  }

  setHint(game, hint) {
    console.log(`setHint(server)'s hint is ${hint}`);
    game.hint = hint;
  }

  invalidateHint(game) {
    // TODO: rename to pauseTurn()
    game.turnStatus = TurnStatus.PAUSED;
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
      this.endTurn(game);
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

  endTurn(game) {
    game.turnStatus = TurnStatus.ENDED;
    this.markAllPlayersInactive(game);
  }

  checkIfTurnIsEnded(roomCode) {
    const game = gameStore.getGame(roomCode);
    return game.turnStatus === TurnStatus.ENDED;
  }

  incrementCodemasterScore(game, scoreChange) {
    const codemasterIndex = game.currentCodemasterIndex;
    const userID = game.playerArchive[codemasterIndex];
    const codemaster = game.players.get(userID);

    console.log(`codemasterIndex is ${codemasterIndex}`);
    console.log(`userID is ${userID}`);
    console.log(`codemaster is ${codemaster}`);

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
    const tile = game.tiles[tileIndex];
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
}

export default GameService;
