import { io } from "socket.io-client";

const socket = io();
console.log("Maybe new socket from io() from socket.io-client was made?")
const userID = sessionStorage.getItem("userID");
if (userID) {
  socket.auth = { userID };
}
socket.on("userID", ({ userID }) => {
  socket.auth = { userID };
  sessionStorage.setItem("userID", userID);
});


export function createGame(name, history) {
  socket.emit("createGame", name, (roomCode) => history.push(`/${roomCode}`));
}

export function joinGame(name, roomCode, history) {
  // TODO: can fail for no room or name taken
  socket.emit("joinGame", name, roomCode, (roomCode) => history.push(`/${roomCode}`));
}

export function getPlayers(roomCode, setPlayers) {
  socket.emit("getPlayers", roomCode, (players) => setPlayers(players));
}

export function registerListener(event, callback) {
  socket.on(event, callback);
}
