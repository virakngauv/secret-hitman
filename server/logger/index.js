import gameStore from "../GameStore.js";

// Use for player activated events, not timer or server acted events (e.g. use for "playAgain" not for "getTiles")
export function logGameSnapshot(roomCode, userID, eventName, eventArgument) {
  const game = gameStore.getGame(roomCode);
  const gameState = game.gameState;
  const roundPhase = game.roundPhase;
  const roundNumber = game.roundNumber;
  const turnStatus = game.turnStatus;
  // TODO: figure out what I want to do with this game prop; it's not really used but kinda is. should fully add or remove it.
  const turnNumber = game.turnNumber;
  const playerName = game.players.get(userID).name;
  console.log(`${roomCode}.${gameState}.${roundNumber}(${roundPhase}).${turnNumber}(${turnStatus}): ${playerName} fired ${eventName}${!!eventArgument && ` with "${eventArgument}"`}`);

  logPlayerSlush(roomCode);
}

export function logTimerEvent(roomCode, eventName, functionName) {
  console.log(`Timer from "${eventName}" event executed function ${functionName}`);

  logPlayerSlush(roomCode);
}

function logPlayerSlush(roomCode) {
  const game = gameStore.getGame(roomCode);

  let playerSlush = "";
  const players = game.players;
  players.forEach((player, userID) => {
    playerSlush += `${userID}(${player.name}):${player.status},`
  });

  // Two spaces are intentional
  console.log(`  ${roomCode}.playerSlush: ${playerSlush}`);
}