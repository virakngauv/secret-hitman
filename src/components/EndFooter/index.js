import { Button, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom"

function EndFooter() {
  const history = useHistory();

  // Probably should put them back into lobby
  const markPlayAgain = () => console.log("Wants to play again!");

  // Should take them out of the game then move them to the welcome screen
    const leaveGame = () => {
    console.log("Leaving game!");
    history.push("/");
  }

  return (
    <>
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={markPlayAgain} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-1">
            Play Again!
          </Button>
          <Button onClick={leaveGame} variant="outline-secondary" size="sm" className="btn-menu ms-1 me-auto">
            Leave Game
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default EndFooter;
