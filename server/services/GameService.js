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
    this.maxRounds = 2;
    this.totalNumberOfTiles = 12;
  }

  initializeGame(roomCode) {
    console.log(`Inside initializeGame with roomCode: ${roomCode}`);

    // TODO: init game
    /*
      gamestate: game
      players: codemaster assigned, others made inactive
      tiles: pull from dictionary, assign types

    */
    const game = gameStore.getGame(roomCode);

    this.updateGameState(roomCode, GameState.GAME);
    this.updateTurnStatus(game, TurnStatus.STARTED);
    // Tiles will be active, which is funny if people want to select tiles before the hint is revealed
    // this.markAllPlayersInactive(game);
    this.assignNextCodemaster(roomCode);
    this.incrementRoundNumber(game);
    this.setupNewTiles(game);
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
        // game.roundNumber = roundNumber + 1;
        this.incrementRoundNumber(game);
        nextCodemasterIndex = 0;
        // game.currentCodemasterIndex = 0;
      }

      if (game.roundNumber > this.maxRounds) {
        this.updateGameState(roomCode, GameState.END);
        return;
      }

      const nextPossibleCodemaster = players.get(playerArchive[nextCodemasterIndex]);
      
      if (nextPossibleCodemaster) {
        nextPossibleCodemaster.status = PlayerStatus.CODEMASTER;
        nextPossibleCodemaster.canSeeBoard = true;
        game.currentCodemasterIndex = nextCodemasterIndex;
        break;
      }

      nextCodemasterIndex = nextCodemasterIndex + 1;
    }
  }

  incrementRoundNumber(game) {
    game.roundNumber += 1;
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

  getMessagesForUser(roomCode, userID) {
    const game = gameStore.getGame(roomCode);
    const turnStatus = game.turnStatus;
    const hint = game.hint;

    const players = game.players;
    const player = players.get(userID);
    const playerStatus = player.status;
    const playerCanSeeBoard = player.canSeeBoard;
    const allPlayersReady = Array.from(players.values()).reduce(
      (readyStatusSoFar, currentPlayer) => {
        return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
      }, true
    );

    let headerMessage = "";
    let footerMessage = "";

    if (turnStatus === TurnStatus.STARTED && hint === "") {
      const preHintMessage = playerStatus === PlayerStatus.CODEMASTER ? "type your hint below" : "hint pending..";
      headerMessage = preHintMessage;
    } else if (turnStatus === TurnStatus.PAUSED) {
      const turnPausedMessage = "hint marked as invalid, pending codemaster..";
      headerMessage = turnPausedMessage;
    } else if (turnStatus === TurnStatus.ENDED) {
      const turnEndedMessages = "turn ended";
      headerMessage = turnEndedMessages;

      if (!playerCanSeeBoard) {
        footerMessage = "Reveal Tiles?";
      } else if (playerStatus === PlayerStatus.INACTIVE) {
        footerMessage = "Ready for Next Turn?";
      } else if (!allPlayersReady) {
        footerMessage = "Waiting on Other Players";
      } else {
        footerMessage = "Start Next Turn?"
      }
    } 

    return [headerMessage, footerMessage];
  }

  getHint(roomCode) {
    const game = gameStore.getGame(roomCode);
    const hint = game.hint;

    return hint;
  }

  setHint(game, hint) {
    // console.log(`setHint(server)'s hint is ${hint}`);
    game.hint = hint;
  }

  // TODO: rename to pauseTurn()
  invalidateHint(game) {
    game.turnStatus = TurnStatus.PAUSED;
  }

  resetHint(game) {
    // TODO: make constant for default hint for use here and on init
    const hint = "";
    this.setHint(game, hint);
  }

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

  startNextTurn(roomCode) {
    const game = gameStore.getGame(roomCode);

    // check turn is ended
    // prepare for next turn
    //    update game object
    this.preparePlayersForNextTurn(game);
    this.assignNextCodemaster(roomCode);
    this.resetHint(game);
    this.setupNewTiles(game);
    this.updateTurnStatus(game, TurnStatus.STARTED);
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
}

export default GameService;
