import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import { useState } from "react";
import MenuHeader from "../MenuHeader";
import { createGame } from "../../api"
// import { io } from "socket.io-client";

function CreateGameScreen() {
  const [name, setName] = useState("");
  const handleNameChange = (e) => {setName(e.target.value);};
  console.log("name is ", name);

  const history = useHistory();
  const goBack = () => history.goBack();

  const createGameScreenTitle = "Create Game";
  const createGameScreenSubtitle = "Pick a name!";
  // Buttons: Back, Create->Uses API to make a new room and goes to that lobby

  const title = createGameScreenTitle;
  const subtitle = createGameScreenSubtitle;

  // const socket = io();
  // const createRoom = (username) => {
  //   socket.emit("createRoom", username, (roomCode) => history.push(`/${roomCode}`));
  // }
  function handleCreateGame() {
    createGame(name, history);
  }

  return (
    <>
      <Container className="screen">
        <MenuHeader title={title} subtitle={subtitle} />
        <Form>
          <Row className="mb-1">
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
              <Button onClick={() => {handleCreateGame()}} variant="outline-secondary" size="sm" className="btn-menu ms-1 me-auto">
                Create
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
  
export default CreateGameScreen;
