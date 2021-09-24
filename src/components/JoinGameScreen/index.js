import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useState } from "react";
import { useHistory } from "react-router";
import MenuHeader from "../MenuHeader";
import { joinGame } from "../../api";

function JoinGameScreen() {
  const [name, setName] = useState("");
  const handleNameChange = (e) => {setName(e.target.value);};
  const [roomCode, setRoomCode] = useState("");
  const handleRoomCodeChange = (e) => {setRoomCode(e.target.value);};

  const history = useHistory();
  const goBack = () => history.goBack();

  const title = "Join Game";
  const subtitle = "Enter a room code and pick a name!";
  // Buttons: Back, Join->Goes to lobby

  function handleSubmit(e) {
    e.preventDefault();
    joinGame(name, roomCode, history);
  }

  // const title = joinGameScreenTitle;
  // const subtitle = joinGameScreenSubtitle;
  // function handleJoinGame(e) {
  //   console.log(e);
  //   joinGame(name, roomCode, history);
  // }

  return (
    <>
      <Container className="screen">
        <MenuHeader title={title} subtitle={subtitle} />
        <Form onSubmit={handleSubmit}>
          <Row className="mb-1">
            <Col className="d-flex">
              <Form.Group controlId="roomCode" className="ms-auto me-auto">
                <Form.Label column="sm">Room Code</Form.Label>
                <Form.Control value={roomCode} onChange={handleRoomCodeChange} size="sm" placeholder="Enter a room code" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="d-flex">
              <Form.Group controlId="playerName" className="ms-auto me-auto">
                <Form.Label column="sm">Name</Form.Label>
                <Form.Control value={name} onChange={handleNameChange} size="sm" placeholder="Enter your name" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex mt-4">
              <Button onClick={goBack} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-1">
                Back
              </Button>
              <Button type="submit" variant="outline-secondary" size="sm" className="btn-menu ms-1 me-auto">
                Join
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
  
export default JoinGameScreen;
