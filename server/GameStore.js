import { original } from "./dictionaries/index.js";
import { generateRandomRoomCode } from "./helpers/index.js";
import { shuffledArray } from "./helpers/util/index.js";

// TODO: Make enum for PlayerStatus, GameStatus
const PlayerStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive", 
  CODEMASTER: "codemaster",
};

const GameState = {
  LOBBY: "lobby",
  GAME: "game",
  END: "end",
}

class GameStore {
  constructor() {
    this.games = new Map();
  }

  createGame() {
    const roomCode = this.generateNewRoomCode();

    // const game = new Map();
    const game = {
      gameState: GameState.LOBBY,
      players: new Map(),
      hint: "",
      tiles: [],
      turnStatus: null,
      dictionary: shuffledArray(original),
      nextDictionary: [],
    }
    // game.set("state", "GameState.LOBBY");
    // game.set("players", new Map([
    //   [userID, {
    //     "name": name,
    //     "status": PlayerStatus.INACTIVE,
    //     "oldScore": 0,
    //     "newScore": 0,
    //   }]]));
    //   // new Map([["name", name],["status", PlayerStatus.INACTIVE],["oldScore", 0],["newScore", 0]])]]));
    // game.set("hint", "");
    // game.set("tiles", []);
    // game.set("turnStatus", null)
    // game.set("dictionary", shuffledArray(original));
    // game.set("nextDictionary", []);

    this.games.set(roomCode, game);

    // console.log("game is ", game);

    return roomCode
  }

  getGame(roomCode) {
    return this.games.get(roomCode);
  }

  hasGame(roomCode) {
    return this.games.has(roomCode);
  }
  
  generateNewRoomCode() {
    let roomCode = generateRandomRoomCode();
  
    while (this.hasGame(roomCode)) {
      roomCode = generateRandomRoomCode();
    }
  
    return roomCode;
  }

  addNewPlayerToGame(userID, name, roomCode) {
    const player = {
      name: name,
      status: PlayerStatus.INACTIVE,
      oldScore: 0,
      newScore: 0,
    }

    this.games.get(roomCode).players.set(userID, player);
  }
}

export default GameStore;
