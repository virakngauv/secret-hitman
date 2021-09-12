import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import "./index.css"

function WelcomeScreen() {
  return (
    <>
      <Container>
        <Row>
          <Col className="welcome-screen-item-parent">
            <h1 className="welcome-screen-title ms-auto me-auto">
              Secret Hitman
            </h1>
          </Col>
        </Row>
        <hr className="welcome-screen-hr" />
        <Row>
          <Col className="welcome-screen-item-parent">
            <Button variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              New Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="welcome-screen-item-parent">
            <Button variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              Join Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="welcome-screen-item-parent">
            <Button variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              How to Play
            </Button>
          </Col>
        </Row>
        <hr className="welcome-screen-hr" />
        <Row>
          <Col className="welcome-screen-item-parent">
            <div className="welcome-screen-footer-text ms-auto me-auto">
              Inspired by: <a href="https://spyfall.tannerkrewson.com/">Spyfall</a>
            </div>
          </Col>
        </Row>

      </Container>
    </>
  );
}
  
export default WelcomeScreen;
