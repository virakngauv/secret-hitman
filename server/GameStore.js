import { original } from "./dictionaries/index.js";
import { generateRandomRoomCode } from "./helpers/index.js";
import { shuffledArray } from "./helpers/util/index.js";
import UserStore from "./UserStore.js";

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
};

const TurnStatus = {
  STARTED: "started",
  PAUSED: "paused",
  ENDED: "ended",
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
      playerArchive: [],
      currentCodemasterIndex: null,
      roundNumber: 0,
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

  addNewPlayerToGame(userID, name, playerID, roomCode) {
    if (this.hasGame(roomCode)) {
      const game = this.getGame(roomCode);
      const gameState = game.gameState;
      const turnStatus = game.turnStatus;
      // TODO: probably add an && turnStatus !== TurnStatus.ENDED to the playerStatus initial value logic
      const playerStatus = gameState === GameState.GAME && turnStatus !== TurnStatus.ENDED ? PlayerStatus.ACTIVE : PlayerStatus.INACTIVE;
      const playerCanSeeBoard = turnStatus === TurnStatus.ENDED ? true : false;

      const player = {
        name,
        id: playerID,
        status: playerStatus,
        oldScore: 0,
        newScore: 0,
        canSeeBoard: playerCanSeeBoard,
      };

      game.players.set(userID, player);
      game.playerArchive.push(userID);
    }
  }

  removePlayerFromGame(userID, roomCode) {
    console.log(`removing ${userID} from game ${roomCode}`);
    if (this.games.has(roomCode)) {
      this.games.get(roomCode).players.delete(userID);
    }
  }
}

// export default GameStore;
// export default new GameStore();
const gameStore = new GameStore();
export default gameStore;
