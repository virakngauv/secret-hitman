import { Col, Container, Form, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import MenuHeader from "../MenuHeader";

function CreateGameScreen() {
  const history = useHistory();
  const goBack = () => history.goBack();

  const createGameScreenTitle = "Create Game";
  const createGameScreenSubtitle = "Pick a name!";
  // Buttons: Back, Create->Uses API to make a new room and goes to that lobby

  const title = createGameScreenTitle;
  const subtitle = createGameScreenSubtitle;

  return (
    <>
      <Container className="screen">
        <MenuHeader title={title} subtitle={subtitle} />
        <Form>
          <Row className="mb-1">
            <Col className="d-flex">
              <Form.Group controlId="playerName" className="ms-auto me-auto">
                <Form.Label column="sm">Name</Form.Label>
                <Form.Control size="sm" placeholder="Enter your name" />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className="d-flex mt-4">
              <Button onClick={goBack} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-1">
                Back
              </Button>
              <Button type="submit" onClick={() => history.push("/guvole")} variant="outline-secondary" size="sm" className="btn-menu ms-1 me-auto">
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
