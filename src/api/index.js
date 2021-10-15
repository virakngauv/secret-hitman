import { io } from "socket.io-client";

const socket = io();
console.log("Maybe new socket from io() from socket.io-client was made?")
const userID = sessionStorage.getItem("userID");
const playerID = sessionStorage.getItem("playerID");
const roomCode = sessionStorage.getItem("roomCode");

if (userID && playerID) {
  console.log("(client) userID is ", userID);
  console.log("(client) playerID is ", playerID);
  socket.auth = { userID, playerID };
}

if (roomCode) {
  console.log("(client) roomCode is ", roomCode);
  socket.auth = {...socket.auth, roomCode}
}

socket.on("newSession", ({ userID, playerID }) => {
  socket.auth = { userID, playerID };
  sessionStorage.setItem("userID", userID);
  sessionStorage.setItem("playerID", playerID);
});


export function joinRoom(roomCode) {
  socket.emit("joinRoom", roomCode);
  sessionStorage.setItem("roomCode", roomCode);
}

export function createGame(name, history) {
  socket.emit("createGame", name, (roomCode) => history.push(`/${roomCode}`));
  sessionStorage.setItem("roomCode", roomCode);
}

export function joinGame(name, roomCode, goToRoom) {
  // TODO: should fail for no room or name taken
  // orr.. join is an easter egg way to create a room if it doesn't exist? 
  // and maybe names can be duplicated to create confusing fun? (self-regulation principle)
  socket.emit("joinGame", name, roomCode, goToRoom);
  sessionStorage.setItem("roomCode", roomCode);
}

export function getGameState(roomCode, setGameState) {
  socket.emit("getGameState", roomCode, (gameState) => setGameState(gameState));
}

export function getPlayers(roomCode, setPlayers) {
  socket.emit("getPlayers", roomCode, (players) => setPlayers(players));
}

export function getIsUserInRoom(roomCode, setIsUserInRoom) {
  socket.emit("getIsUserInRoom", roomCode, (isUserInRoom) => setIsUserInRoom(isUserInRoom));
}

export function getTiles(roomCode, setTiles) {
  socket.emit("getTiles", roomCode, (tiles) => setTiles(tiles));
}

export function claimTile(roomCode, tileIndex) {
  socket.emit("claimTile", roomCode, tileIndex);
}

export function getHint(setHint) {
  socket.emit("getHint", (hint) => setHint(hint));
}

export function submitHint(roomCode, hint) {
  socket.emit("submitHint", roomCode, hint);
  console.log(`submitHint(client)'s hint is ${hint}`);
}

export function invalidateHint() {
  socket.emit("invalidateHint");
}

export function discardHint() {
  socket.emit("discardHint");
}

export function keepHint() {
  socket.emit("keepHint");
}

export function getTurnStatus(setTurnStatus) {
  socket.emit("getTurnStatus", setTurnStatus);
}

export function markPlayerStatus(roomCode, status) {
  socket.emit("markPlayerStatus", roomCode, status);
}

export function startGame(roomCode) {
  // TODO: should have more failure modes that tell the user that something has failed

  console.log("Inside api's startgame");

  socket.emit("startGame", roomCode);
}

export function kickPlayer(roomCode, playerID,) {
  console.log("I am in kickPlayer in the api");

  socket.emit("kickPlayer", roomCode, playerID);
}

export function leaveRoom(roomCode) {
  socket.emit("leaveRoom", roomCode);
}

export function registerListener(event, callback) {
  socket.on(event, callback);
}
