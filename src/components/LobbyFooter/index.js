import { Button, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom"

function LobbyFooter() {
  const history = useHistory();
  const goBack = () => history.goBack();

  const markStatusReady = () => console.log("Status Ready!");
  const startGame = () => console.log("Start Game!")
  const areAllPlayersReady = false;

  return (
    <>
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={markStatusReady} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-1">
            I'm Ready!
          </Button>
          <Button disabled={!areAllPlayersReady} onClick={startGame} variant="outline-secondary" size="sm" className="btn-menu ms-1 me-auto">
            Start Game
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex mt-3">
          <Button onClick={goBack} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-auto">
            Back
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default LobbyFooter;
