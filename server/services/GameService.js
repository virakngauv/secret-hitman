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
  DISABLED_TRANSPARENT: "disabled-transparent"
};

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
    // Tiles will be active, which is funny if people want to select tiles before the hint is revealed
    // this.markAllPlayersInactive(game);
    this.assignNextCodemaster(game, socket);
    this.setupNewTiles(game);
  }

  updateGameState(game, gameState) {
    game.gameState = gameState;
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
      claimer: null,
      claimerID: null,
      state: null,
    }));
  }

  getTilesForUser(game, userID) {
    // const tiles = [...game.tiles]; 
    const tilesCopy = game.tiles.map(tile => {return {...tile}});
    const playerID = userStore.getPlayerID(userID);
    const playerStatus = this.getPlayerStatus(game, playerID);


    if (playerStatus === PlayerStatus.CODEMASTER) {
      tilesCopy.forEach((tile) => {
        delete tile.claimerID;
        tile.state = TileState.DISABLED_OPAQUE;
      });

      return tilesCopy;
    }

    tilesCopy.forEach((tile) => {
      const tileType = tile.type;
      const claimerID = tile.claimerID;
      delete tile.claimerID;

      switch (claimerID) {
        case playerID:
          tile.state = TileState.DISABLED_OPAQUE;
          break;
        case null:
          tile.type = null;

          if (playerStatus === PlayerStatus.ACTIVE) {
            tile.state = TileState.ENABLED;
          } else if (playerStatus === PlayerStatus.INACTIVE) {
            tile.state = TileState.DISABLED_TRANSPARENT;
          } else {
            // Should not be reachable
            console.warn(`Possible Error: playerStatus is ${playerStatus}`);
          }
          break;
        // Default case reached if claimed by another player:
        default:
          if (tileType === TileType.ASSASSIN && playerStatus === PlayerStatus.ACTIVE) {
            tile.claimer = null;
            tile.type = null;
            tile.state = TileState.ENABLED;
          } else {
            tile.state = TileState.DISABLED_TRANSPARENT
          }
      }
    });

    return tilesCopy;
  }

  setHint(game, hint) {
    console.log(`setHint(server)'s hint is ${hint}`);
    game.hint = hint;
  }

  getPlayerStatus(game, playerID) {
    const userID = userStore.getUserID(playerID);
    const player = game.players.get(userID);
    if (player) {
      return player.status
    }
  }

  markPlayerStatus(game, playerID, playerStatus) {
    const userID = userStore.getUserID(playerID);
    const player = game.players.get(userID);
    player.status = playerStatus;
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

  claimTile(game, userID, tileIndex) {
    const tile = game.tiles[tileIndex];
    const playerName = game.players.get(userID).name;
    const playerID = userStore.getPlayerID(userID);

    if (tile.claimer === null) {
      tile.claimer = playerName;
      tile.claimerID = playerID;

      switch (tile.type) {
        case TileType.ASSASSIN:
          this.incrementCodemasterScore(game, -1);
          this.incrementUserScore(game, -1, userID);
          this.markPlayerStatus(game, playerID, PlayerStatus.INACTIVE);
          break;
        case TileType.TARGET:
          this.incrementCodemasterScore(game, 1);
          this.incrementUserScore(game, 1, userID);
          break;
        case TileType.CIVILIAN:
          this.markPlayerStatus(game, playerID, PlayerStatus.INACTIVE);
          break;
        default:
          console.warn(`Tile Type was not assassin, target, or civilian`);
      }
    }
  }
}

export default GameService;
