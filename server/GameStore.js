import { original } from "./dictionaries/index.js";
import { generateRandomRoomCode } from "./helpers/index.js";
import { shuffledArray } from "./helpers/util/index.js";
// import UserStore from "./UserStore.js";

// TODO: Make enum for PlayerStatus, GameStatus
// const PlayerStatus = {
//   ACTIVE: "active",
//   INACTIVE: "inactive", 
//   CODEMASTER: "codemaster",
// };

const GameState = {
  LOBBY: "lobby",
  GAME: "game",
  END: "end",
};

// const TurnStatus = {
//   STARTED: "started",
//   PAUSED: "paused",
//   ENDED: "ended",
// }

class GameStore {
  constructor() {
    this.games = new Map();
  }

  createGame() {
    const roomCode = this.generateNewRoomCode();

    const game = {
      gameState: GameState.LOBBY,
      players: new Map(),
      playerArchive: [],
      currentCodemasterIndex: null,
      currentCodemasterID: null,
      roundNumber: 0,
      turnNumber: 0,
      // hint: "",
      // tiles: [],
      roundPhase: null,
      turnStatus: null,
      dictionary: shuffledArray(original),
      nextDictionary: [],
      timerID: null,
    }
    this.games.set(roomCode, game);
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

  // // TODO: move adding players and removing players to the game service class 
  // addNewPlayerToGame(userID, name, playerID, roomCode) {
  //   if (this.hasGame(roomCode)) {
  //     const game = this.getGame(roomCode);
  //     const gameState = game.gameState;
  //     const turnStatus = game.turnStatus;
  //     const playerStatus = gameState === GameState.GAME && turnStatus !== TurnStatus.ENDED ? PlayerStatus.ACTIVE : PlayerStatus.INACTIVE;
  //     const playerCanSeeBoard = turnStatus === TurnStatus.ENDED ? true : false;

  //     const player = {
  //       name,
  //       id: playerID,
  //       status: playerStatus,
  //       oldScore: 0,
  //       newScore: 0,
  //       hint: "",
  //       tiles: [],
  //       canSeeBoard: playerCanSeeBoard,
  //     };

  //     game.players.set(userID, player);
  //     game.playerArchive.push(userID);
  //   }
  // }

  // removePlayerFromGame(userID, roomCode) {
  //   console.log(`removing ${userID} from game ${roomCode}`);
  //   if (this.games.has(roomCode)) {
  //     this.games.get(roomCode).players.delete(userID);
  //   }
  // }
}

// export default GameStore;
// export default new GameStore();
const gameStore = new GameStore();
export default gameStore;
