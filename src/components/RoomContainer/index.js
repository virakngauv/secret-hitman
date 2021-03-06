import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getGameState, getIsUserInRoom, registerListener, joinRoom } from "../../api";
import LobbyScreen from "../LobbyScreen/index.js";
import GameScreen from "../GameScreen/index.js";
import EndScreen from "../EndScreen/index.js";
import JoinGameScreen from "../JoinGameScreen";

function RoomContainer() {
  // TODO: make GameState enum
  const GameState = {
    LOBBY: "lobby",
    GAME: "game",
    END: "end",
  }

  let { roomCode } = useParams();
  roomCode = roomCode.toLowerCase();
  const [isUserInRoom, setIsUserInRoom] = useState(null);
  const [gameState, setGameState] = useState();
  // const history = useHistory();

  useEffect(() => {
    getGameState(roomCode, setGameState);
    getIsUserInRoom(roomCode, setIsUserInRoom);

    // TODO: maybe pull these into API? depends on rest of structure of code
    registerListener("gameStateChange", () => getGameState(roomCode, setGameState));
  }, [roomCode]);

  if (isUserInRoom === null) {
    // Display nothing if server has not responded yet.
    return null;
  }

  // const isUserInRoom = checkIfRoomHasUser(roomCode, reportIfRoomHasUser);
  if (!isUserInRoom) {
    return <JoinGameScreen roomCode={roomCode} />
  }

  joinRoom(roomCode);

  switch (gameState) {
    case GameState.LOBBY:
      return <LobbyScreen roomCode={roomCode} />
    case GameState.GAME:
      return <GameScreen roomCode={roomCode} setGameState={setGameState} />
    case GameState.END:
      return <EndScreen setGameState={setGameState} />
    default:
      return null
  }
}

export default RoomContainer;
