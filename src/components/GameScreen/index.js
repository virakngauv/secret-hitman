import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import Footer from "../Footer"

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
    "Write the hint below",
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
  const words = [
    {text: "bermuda", type: Type.civilian}, 
    {text: "casino", type: Type.target, claimer: "Tundra",}, 
    {text: "unicorn", type: Type.target, claimer: "Calphanlopos",}, 
    {text: "figure", type: Type.target, claimer: "Beth",}, 
    {text: "mail", type: Type.target}, 
    {text: "drop", type: Type.target,}, 
    {text: "microscope", type: Type.target, claimer: "Tundra",}, 
    {text: "watch", type: Type.target, claimer: "Alfred",}, 
    {text: "atlantis", type: Type.assassin}, 
    {text: "chair", type: Type.target}, 
    {text: "bell", type: Type.target}, 
    {text: "tick", type: Type.target}, 
  ];

  return (
    <Container className="screen">
      <PlayerRoster players={players} />
      <Announcer message={temporaryMessages[0]} />
      <GameBoard words={words} enabled={false} />
      <Footer isCodemaster={false} />
    </Container>
  );
}

export default GameScreen;
  