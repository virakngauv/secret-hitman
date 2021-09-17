import { Container } from "react-bootstrap";
import EndFooter from "../EndFooter/index.js";
import EndRoster from "../EndRoster/index.js";

function EndScreen() {
  const players = [
    {
      name: "Alfred", 
      score: 10, 
    },
    {
      name: "Beth", 
      score: 16, 
    },
    {
      name: "Crim", 
      score: 10, 
    },
    {
      name: "Dion", 
      score: 0, 
    },
    {
      name: "Calphanlopos", 
      score: 6, 
    },
    {
      name: "Tundra", 
      score: 12, 
    },
  ];

  return (
    <Container className="screen">
      <EndRoster players={players} />
      <EndFooter />
    </Container>
  );
}

export default EndScreen;
