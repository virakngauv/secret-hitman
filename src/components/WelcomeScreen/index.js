import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import AppFooter from "../AppFooter";

import "./index.css"

function WelcomeScreen() {
  const history = useHistory();
  const navigateTo = (route) => {return () => history.push(route)};

  return (
    <>
      <Container>
        <Row>
          <Col className="d-flex">
            <h1 className="welcome-screen-title ms-auto me-auto">
              Secret Hitman
            </h1>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <div className="welcome-screen-subtitle ms-auto me-auto">
            A fast-paced word game based on Codenames.
            </div>
          </Col>
        </Row>
        <hr className="app-hr" />
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/create-game")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              New Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/join-game")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              Join Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/rules")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              How to Play
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/temp-mid-game")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              (temp) mid-game
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
  
export default WelcomeScreen;
