import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getGameState, getIsUserInRoom, registerListener } from "../../api";
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

  const { roomCode } = useParams();
  const [isUserInRoom, setIsUserInRoom] = useState();
  const [gameState, setGameState] = useState();
  // const history = useHistory();

  useEffect(() => {
    getGameState(roomCode, setGameState);
    getIsUserInRoom(roomCode, setIsUserInRoom);

    // TODO: maybe pull these into API? depends on rest of structure of code
    registerListener("gameStateChange", () => getGameState(roomCode, setGameState));
  }, [roomCode]);

  // const isUserInRoom = checkIfRoomHasUser(roomCode, reportIfRoomHasUser);
  if (!isUserInRoom) {
    return <JoinGameScreen roomCode={roomCode} />
  }

  switch (gameState) {
    case GameState.LOBBY:
      return <LobbyScreen />
    case GameState.GAME:
      return <GameScreen />
    case GameState.END:
      return <EndScreen />
    default:
      return null
  }
}

export default RoomContainer;
