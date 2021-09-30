class UserStore {
  constructor() {
    this.users = new Map();
    this.players = new Map();
  }

  // getRoomCodes(userID) {
  //   return this.users.get(userID);
  // }

  // addRoomCode(userID, roomCode) {
  //   if (this.users.has(userID)) {
  //     this.users.get(userID).add(roomCode);
  //   } else {
  //     this.users.set(userID, new Set([roomCode]));
  //   }
  // }

  // removeRoomCodeFromUser(userID, roomCode) {
  //   if (this.users.has(userID)) {
  //     this.users.get(userID).delete(roomCode);
  //   }
  // }
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

export default UserStore;
