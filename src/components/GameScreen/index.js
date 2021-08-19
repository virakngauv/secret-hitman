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
      name: "Caphanies", 
      score: 4, 
      status: Status.inactive
    },

  ];

  return (
    <Container className="screen">
      <PlayerRoster players={players} />
      <Announcer />
      <GameBoard />
      <Footer />
    </Container>
  );
}

export default GameScreen;
  