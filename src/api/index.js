import { io } from "socket.io-client";

const socket = io();

export function createGame(username, history) {
  socket.emit("createGame", username, (roomCode) => history.push(`/${roomCode}`));
}

export function getPlayers(roomCode, setPlayers) {
  socket.emit("getPlayers", roomCode, (players) => setPlayers(players));
}
