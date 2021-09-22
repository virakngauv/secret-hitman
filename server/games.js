import { original } from "./dictionaries/index.js";
import { generateRandomRoomCode } from "./helpers/index.js";
import { shuffleArray } from "./helpers/util/index.js";

class GameStore {
  constructor() {
    this.games = new Map();
  }

  createRoom() {
    const roomCode = this.generateNewRoomCode();

    const game = new Map();
    game.set("state", "GameState.LOBBY");
    game.set("players", new Map());
    game.set("hint", "");
    game.set("tiles", []);
    game.set("turnStatus", null)
    game.set("dictionary", shuffleArray(original));
    game.set("nextDictionary", []);

    this.games.set(roomCode, game);

    return roomCode
  }

  findGame(roomCode) {
    return this.games.has(roomCode);
  }
  
  generateNewRoomCode() {
    let roomCode = generateRandomRoomCode();
  
    while (this.findGame(roomCode)) {
      roomCode = generateRandomRoomCode();
    }
  
    return roomCode;
  }
}

export default GameStore;
