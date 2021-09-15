import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory, useParams } from "react-router";

import "./index.css"

function WelcomeScreen() {
  const history = useHistory();
  const navigateTo = (route) => {return () => history.push(route)};

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
        <Row>
          <Col className="welcome-screen-item-parent">
            <div className="welcome-screen-subtitle ms-auto me-auto">
            A fast-paced word game based on Codenames.
            </div>
          </Col>
        </Row>
        <hr className="welcome-screen-hr" />
        <Row>
          <Col className="welcome-screen-item-parent">
            <Button onClick={navigateTo("/create-game")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              New Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="welcome-screen-item-parent">
            <Button onClick={navigateTo("/join-game")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              Join Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="welcome-screen-item-parent">
            <Button onClick={navigateTo("/rules")} variant="outline-secondary" className="welcome-screen-button ms-auto me-auto">
              How to Play
            </Button>
          </Col>
        </Row>
        <hr className="welcome-screen-hr" />
        <Row>
          <Col className="welcome-screen-item-parent">
            <div className="welcome-screen-footer-text ms-auto me-auto">
              Inspired by: <a href="https://spyfall.tannerkrewson.com/">Spyfall</a> | Consulting these fine <a href="/#">folks</a>.
            </div>
          </Col>
        </Row>

      </Container>
    </>
  );
}
  
export default WelcomeScreen;
