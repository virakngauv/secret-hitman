import { Button, Col, Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router";
import Status from "../../constants/status.js";
import StatusIndicator from "../StatusIndicator";

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

  const markStatusReady = () => console.log("Status Ready!");
  const startGame = () => console.log("Start Game!")
  const areAllPlayersReady = false;

  return (
    <Container>
      <Row>
        <Col className="d-flex">
          <div className="fs-sm ms-auto me-auto">
            <b>Room Code</b>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="d-flex">
          <div className="fs-sm ms-auto me-auto">
            {roomCode}
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex">
          <Table borderless hover size="sm" className="fs-sm ms-auto me-auto">
            <thead>
              <tr>
                <th className="text-center">Status</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => {
                return (
                  <tr>
                    <td className="text-center"><StatusIndicator status={player.status} /></td>
                    <td>{player.name}</td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={markStatusReady} variant="outline-secondary" size="sm" className="ms-auto me-1">
            I'm Ready!
          </Button>
          <Button disabled={!areAllPlayersReady} onClick={startGame} variant="outline-secondary" size="sm" className="ms-1 me-auto">
            Start Game
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default LobbyScreen;
