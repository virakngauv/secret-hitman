import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import Status from "../../constants/status.js";
import LobbyFooter from "../LobbyFooter/index.js";
import LobbyRoster from "../LobbyRoster/index.js";
import MenuHeader from "../MenuHeader/index.js";
import RoomCode from "../RoomCode/index.js";

function LobbyScreen() {
  const { roomCode } = useParams();

  const history = useHistory();

  const title = "Lobby";
  const subtitle = "Share your room code below to add more players!";
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
      <MenuHeader title={title} subtitle={subtitle} />
      <RoomCode roomCode={roomCode} />
      <LobbyRoster players={players} />
      <LobbyFooter />
      <Row>
        <Col className="d-flex mt-3">
          <Button type="submit" onClick={() => history.push("/temp-mid-game")} variant="outline-secondary" size="sm" className="ms-auto me-auto">
            (temp) mid-game
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default LobbyScreen;
