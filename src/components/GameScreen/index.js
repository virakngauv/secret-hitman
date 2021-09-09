import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import Footer from "../Footer"
import { useState } from "react";
import Type from "../../constants/type.js";
import Status from "../../constants/status.js";
import State from "../../constants/state.js";

// TODO: Make Status Enum and import

function GameScreen() {
  const players = [
    {
      name: "Alfred", 
      score: 9, 
      status: Status.ACTIVE
    },
    {
      name: "Beth", 
      score: 13, 
      status: Status.CODEMASTER
    },
    {
      name: "Crim", 
      score: 10, 
      status: Status.ACTIVE
    },
    {
      name: "Dion", 
      score: -2, 
      status: Status.INACTIVE
    },
    {
      name: "Calphanlopos", 
      score: 4, 
      status: Status.INACTIVE
    },
    {
      name: "Tundra", 
      score: 12, 
      status: Status.ACTIVE
    },
  ];

  const codemasterMessages = [
    "Type your hint below",
  ];
  const guesserMessages = [
    "Calphanlopos is thinking..",
    "Ready up!",
    "salty ∞",
  ];
  const temporaryMessages = [
    "Dion hit the assassin!",
    "Crim also hit the assassin!",
    "Beth hit a target!",
    "Alfred hit a civilian!",
  ];

  const initTiles = [
    {word: "bermuda", state: State.ENABLED}, 
    {word: "casino", type: Type.TARGET, claimer: "Tundra", state: State.ENABLED}, 
    {word: "unicorn", type: Type.TARGET, claimer: "Calphanlopos", state: State.ENABLED}, 
    {word: "figure", type: Type.TARGET, claimer: "Beth", state: State.ENABLED}, 
    {word: "mail", state: State.ENABLED}, 
    {word: "drop", state: State.ENABLED}, 
    {word: "microscope", type: Type.TARGET, claimer: "Tundra", state: State.ENABLED}, 
    {word: "watch", type: Type.TARGET, claimer: "Alfred", state: State.ENABLED}, 
    {word: "atlantis", type: Type.ASSASSIN, claimer: "Dion", state: State.ENABLED}, 
    {word: "chair", type: Type.CIVILIAN, claimer: "Alfred", state: State.ENABLED}, 
    {word: "bell", state: State.ENABLED}, 
    {word: "tick", state: State.ENABLED}, 
  ];

  const [tiles, setTiles] = useState(initTiles);

  const codemasterTiles = [
    {word: "bermuda", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "casino", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "unicorn", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "figure", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "mail", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "drop", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "microscope", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "watch", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "atlantis", type: Type.ASSASSIN, state: State.DISABLED_OPAQUE}, 
    {word: "chair", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "bell", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "tick", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
  ];

  // TODO: get value from server
  const isCodemaster = false;

  const [isForceDisabled, setIsForceDisabled] = useState(isCodemaster);

  return (
    <Container className="screen">
      <PlayerRoster players={players} />
      <Announcer message={isCodemaster ? codemasterMessages : guesserMessages[2]} />
      <GameBoard tiles={isCodemaster ? codemasterTiles : tiles} setTiles={setTiles} isForceDisabled={isForceDisabled} setIsForceDisabled={setIsForceDisabled} />
      <Footer isCodemaster={isCodemaster} />
    </Container>
  );
}

export default GameScreen;
  