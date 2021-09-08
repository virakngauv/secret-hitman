import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import Footer from "../Footer"
import { useState } from "react";

// TODO: Make Status Enum and import

function GameScreen() {
  const Status = {
    active: "active",
    inactive: "inactive", 
    codemaster: "codemaster"
  };
  const players = [
    {
      name: "Alfred", 
      score: 9, 
      status: Status.active
    },
    {
      name: "Beth", 
      score: 13, 
      status: Status.codemaster
    },
    {
      name: "Crim", 
      score: 10, 
      status: Status.active
    },
    {
      name: "Dion", 
      score: -2, 
      status: Status.inactive
    },
    {
      name: "Calphanlopos", 
      score: 4, 
      status: Status.inactive
    },
    {
      name: "Tundra", 
      score: 12, 
      status: Status.active
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

  // TODO: Make Enum for word type
  const Type = {
    target: "target", 
    civilian: "civilian", 
    assassin: "assassin"
  };
  const initWords = [
    {text: "bermuda"},
    {text: "casino", type: Type.target, claimer: "Tundra",},
    {text: "unicorn", type: Type.target, claimer: "Calphanlopos",}, 
    {text: "figure", type: Type.target, claimer: "Beth",}, 
    {text: "mail"}, 
    {text: "drop"}, 
    {text: "microscope", type: Type.target, claimer: "Tundra",}, 
    {text: "watch", type: Type.target, claimer: "Alfred",}, 
    {text: "atlantis", type: Type.assassin, claimer: "Dion"}, 
    {text: "chair", type: Type.civilian, claimer: "Alfred"}, 
    {text: "bell"}, 
    {text: "tick"}, 
  ];

  const [words, setWords] = useState(initWords);

  const codemasterWords = [
    {text: "bermuda", type: Type.civilian},
    {text: "casino", type: Type.target},
    {text: "unicorn", type: Type.target}, 
    {text: "figure", type: Type.target}, 
    {text: "mail", type: Type.civilian}, 
    {text: "drop", type: Type.civilian}, 
    {text: "microscope", type: Type.target}, 
    {text: "watch", type: Type.target}, 
    {text: "atlantis", type: Type.assassin}, 
    {text: "chair", type: Type.civilian}, 
    {text: "bell", type: Type.civilian}, 
    {text: "tick", type: Type.civilian}, 
  ];

  // TODO: get value from server
  const isCodemaster = false;

  return (
    <Container className="screen">
      <PlayerRoster players={players} />
      <Announcer message={isCodemaster ? codemasterMessages : guesserMessages[2]} />
      <GameBoard words={isCodemaster ? codemasterWords : words} setWords={setWords} isForceDisabled={isCodemaster} />
      <Footer isCodemaster={isCodemaster} />
    </Container>
  );
}

export default GameScreen;
  