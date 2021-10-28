class UserStore {
  constructor() {
    this.users = new Map();
    this.players = new Map();
  }

  getPlayerID(userID) {
    return this.users.get(userID);
  }

  getUserID(playerID) {
    return this.players.get(playerID);
  }

  setPlayerID(userID, playerID) {
    this.users.set(userID, playerID);
    this.players.set(playerID, userID);
  }

  deleteUser(userID) {
    if (this.users.has(userID)) {
      const playerID = this.users.get(userID);
      this.users.delete(userID);
      this.players.delete(playerID);
    }
  }
}

const userStore = new UserStore();
export default userStore;
