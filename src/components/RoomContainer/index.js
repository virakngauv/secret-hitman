import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { getGameState, registerListener } from "../../api";
import LobbyScreen from "../LobbyScreen/index.js";
import GameScreen from "../GameScreen/index.js";
import EndScreen from "../EndScreen/index.js";

function RoomContainer() {
  const GameState = {
    LOBBY: "lobby",
    GAME: "game",
    END: "end",
  }

  const { roomCode } = useParams();
  const [gameState, setGameState] = useState(GameState.LOBBY);
  const history = useHistory();

  useEffect(() => {
    getGameState(roomCode, setGameState)

    // TODO: maybe pull these into API? depends on rest of structure of code
    registerListener("gameChange", () => getGameState(roomCode, setGameState));
  }, [roomCode]);

  switch (gameState) {
    case GameState.LOBBY:
      return <LobbyScreen />
    case GameState.GAME:
      return <GameScreen />
    case GameState.END:
      return <EndScreen />
    default:
      history.push("/");
  }
}

export default RoomContainer;
