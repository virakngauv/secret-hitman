class UserStore {
  constructor() {
    this.users = new Map();
  }

  getRoomCodes(userID) {
    return this.users.get(userID);
  }

  addRoomCode(userID, roomCode) {
    if (this.users.has(userID)) {
      this.users.get(userID).add(roomCode);
    } else {
      this.users.set(userID, new Set([roomCode]));
    }
  }

  removeRoomCodeFromUser(userID, roomCode) {
    if (this.users.has(userID)) {
      this.users.get(userID).delete(roomCode);
    }
  }

  deleteUser(userID) {
    this.users.delete(userID);
  }
}

export default UserStore;
