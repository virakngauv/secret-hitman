import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import MenuHeader from "../MenuHeader";

function JoinGameScreen() {
  const history = useHistory();
  const goBack = () => history.goBack();

  const joinGameScreenTitle = "Join Game";
  const joinGameScreenSubtitle = "Enter a room code and pick a name!";
  // Buttons: Back, Join->Goes to lobby

  const title = joinGameScreenTitle;
  const subtitle = joinGameScreenSubtitle;

  return (
    <>
      <Container className="screen">
        <MenuHeader title={title} subtitle={subtitle} />
        <Form>
          <Row className="mb-1">
            <Col className="d-flex">
              <Form.Group controlId="roomCode" className="ms-auto me-auto">
                <Form.Label column="sm">Room Code</Form.Label>
                <Form.Control size="sm" placeholder="Enter a room code" />
              </Form.Group>
            </Col>
            
          </Row>
          <Row className="mb-3">
            <Col className="d-flex">
              <Form.Group controlId="playerName" className="ms-auto me-auto">
                <Form.Label column="sm">Name</Form.Label>
                <Form.Control size="sm" placeholder="Enter your name" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex mt-4">
              <Button onClick={goBack} variant="outline-secondary" size="sm" className="ms-auto me-1">
                Back
              </Button>
              <Button type="submit" onClick={() => {console.log("Join button has been clicked!")}} variant="outline-secondary" size="sm" className="ms-1 me-auto">
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
