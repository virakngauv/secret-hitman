import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { getPlayers } from "../../api";
import EndFooter from "../EndFooter";
import EndRoster from "../EndRoster";
import MenuHeader from "../MenuHeader";

function EndScreen(props) {
  const setGameState = props.setGameState;

  const title = "Rankings";
  const subtitle = "Hope you had fun! Come back soon!";
  // const players = [
  //   {
  //     name: "Alfred", 
  //     score: 10, 
  //   },
  //   {
  //     name: "Beth", 
  //     score: 16, 
  //   },
  //   {
  //     name: "Crim", 
  //     score: 10, 
  //   },
  //   {
  //     name: "Dion", 
  //     score: 0, 
  //   },
  //   {
  //     name: "Calphanlopos", 
  //     score: 6, 
  //   },
  //   {
  //     name: "Tundra", 
  //     score: 12, 
  //   },
  // ];

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // TODO: remove all getPlayers function that use roomCode
    getPlayers(setPlayers);
  }, []);

  return (
    <Container className="screen">
      <MenuHeader title={title} subtitle={subtitle} />
      <EndRoster players={players} />
      <EndFooter setGameState={setGameState} />
    </Container>
  );
}

export default EndScreen;
