import { Col, Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import MenuHeader from "../MenuHeader";

import "./index.css"

function WelcomeScreen() {
  const history = useHistory();
  const navigateTo = (route) => {return () => history.push(route)};

  const title = "Secret Hitman";
  const subtitle = "A fast-paced word game based on Codenames.";

  return (
    <>
      <Container className="screen">
        <MenuHeader title={title} subtitle={subtitle} />
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/new")} variant="outline-secondary" size="sm" className="btn-menu btn-welcome-screen ms-auto me-auto">
              New Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/join")} variant="outline-secondary" size="sm" className="btn-menu btn-welcome-screen ms-auto me-auto">
              Join Game
            </Button>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex">
            <Button onClick={navigateTo("/rules")} variant="outline-secondary" size="sm" className="btn-menu btn-welcome-screen ms-auto me-auto">
              Rules
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
  
export default WelcomeScreen;
