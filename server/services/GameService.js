import gameStore from "../GameStore.js";
import { shuffledArray } from "../helpers/util/index.js";

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

const TileType = {
  TARGET: "target", 
  CIVILIAN: "civilian",
  ASSASSIN: "assassin",
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
    this.markAllPlayersInactive(game);
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
    }));
  }
}

export default GameService;