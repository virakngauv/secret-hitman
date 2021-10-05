import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import GameFooter from "../GameFooter"
import { useEffect, useState } from "react";
import Type from "../../constants/type.js";
import Status from "../../constants/status.js";
import State from "../../constants/state.js";
import { useHistory, useParams } from "react-router";
import { Button, Col, Row } from "react-bootstrap";
import { getPlayers, getTiles, getHint, registerListener } from "../../api";

const PlayerStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  CODEMASTER: "codemaster",
}

function GameScreen() {
//   const players = [
//     {
//       name: "Alfred", 
//       score: 9, 
//       status: Status.ACTIVE
//     },
//     {
//       name: "Beth", 
//       score: 13, 
//       status: Status.CODEMASTER
//     },
//     {
//       name: "Crim", 
//       score: 10, 
//       status: Status.ACTIVE
//     },
//     {
//       name: "Dion", 
//       score: -2, 
//       status: Status.INACTIVE
//     },
//     {
//       name: "Calphanlopos", 
//       score: 4, 
//       status: Status.INACTIVE
//     },
//     {
//       name: "Tundra", 
//       score: 12, 
//       status: Status.ACTIVE
//     },
//   ];

//   const codemasterMessages = [
//     "Type your hint below",
//   ];
//   const guesserMessages = [
//     "Calphanlopos is thinking..",
//     "Ready up!",
//     "Machine 5",
//   ];
//   const temporaryMessages = [
//     "Dion hit the assassin!",
//     "Crim also hit the assassin!",
//     "Beth hit a target!",
//     "Alfred hit a civilian!",
//   ];

//   const initTiles = [
//     {word: "bermuda", state: State.ENABLED}, 
//     {word: "casino", type: Type.TARGET, claimer: "Tundra", state: State.DISABLED_TRANSPARENT}, 
//     {word: "unicorn", type: Type.TARGET, claimer: "Calphanlopos", state: State.DISABLED_TRANSPARENT}, 
//     {word: "figure", type: Type.TARGET, claimer: "Beth", state: State.DISABLED_TRANSPARENT}, 
//     {word: "mail", state: State.ENABLED}, 
//     {word: "drop", state: State.ENABLED}, 
//     {word: "microscope", state: State.ENABLED}, 
//     {word: "watch", type: Type.TARGET, claimer: "Alfred", state: State.DISABLED_OPAQUE}, 
//     {word: "atlantis", state: State.ENABLED}, 
//     {word: "chair", type: Type.CIVILIAN, claimer: "Tundra", state: State.DISABLED_TRANSPARENT}, 
//     {word: "bell", state: State.ENABLED}, 
//     {word: "tick", state: State.ENABLED}, 
//   ];

//   const [tiles, setTiles] = useState(initTiles);

//   const codemasterTiles = [
//     {word: "bermuda", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "casino", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "unicorn", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "figure", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "mail", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "drop", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "microscope", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "watch", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "atlantis", type: Type.ASSASSIN, state: State.DISABLED_OPAQUE}, 
//     {word: "chair", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "bell", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "tick", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//   ];

  const { roomCode } = useParams();
  const history = useHistory();

  // TODO: get value from server
  const [players, setPlayers] = useState([]);
  // const [isCodemaster, setIsCodemaster] = useState(false);
  const playerID = sessionStorage.getItem("playerID");
  const player = players.find((player) => player.id === playerID)
  const isCodemaster = player && player.status === PlayerStatus.CODEMASTER;
  // const [isForceDisabled, setIsForceDisabled] = useState(false);
  // setIsForceDisabled(isCodemaster);

  console.log(`playerID is ${playerID}`);
  console.log(`player is ${JSON.stringify(player, null, 2)}`);
  console.log(`isCodemaster is ${isCodemaster}`);
  // console.log(`isForceDisabled is ${isForceDisabled}`);

  const [tiles, setTiles] = useState([]);
  const [hint, setHint] = useState("");

  const initialMessage = isCodemaster ? "type your hint below" : "codemaster is thinking.."
  const message = hint === "" ? initialMessage : hint;

  useEffect(() => {
    getPlayers(roomCode, setPlayers);
    getTiles(roomCode, setTiles);
    getHint(roomCode, setHint);

    registerListener("playerChange", () => getPlayers(roomCode, setPlayers));
    registerListener("tileChange", () => getTiles(roomCode, setTiles));
    registerListener("hintChange", () => getHint(roomCode, setHint));
    

    /* 
      Fetch players data
      fetch game tile data
      hint data

    */ 
  }, [roomCode]);

  return (
    <Container className="screen">
      <PlayerRoster players={players} />
      <Announcer message={message} />
      <GameBoard tiles={tiles} setTiles={setTiles} isCodemaster={isCodemaster} />
      <GameFooter isCodemaster={isCodemaster} />
    </Container>
  );
}

export default GameScreen;
