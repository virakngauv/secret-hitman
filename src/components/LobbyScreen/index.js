import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Status from "../../constants/status.js";
import LobbyFooter from "../LobbyFooter/index.js";
import LobbyRoster from "../LobbyRoster/index.js";
import RoomCode from "../RoomCode/index.js";

function LobbyScreen() {
  const { roomCode } = useParams();

  const players = [
    {
      name: "Alfred", 
      status: Status.ACTIVE
    },
    {
      name: "Beth", 
      status: Status.ACTIVE
    },
    {
      name: "Crim", 
      status: Status.ACTIVE
    },
    {
      name: "Dion", 
      status: Status.INACTIVE
    },
    {
      name: "Calphanlopos", 
      status: Status.INACTIVE
    },
    {
      name: "Tundra", 
      status: Status.ACTIVE
    },
  ];

  return (
    <Container className="screen">
      <RoomCode roomCode={roomCode} />
      <LobbyRoster players={players} />
      <LobbyFooter />
    </Container>
  );
}

export default LobbyScreen;
