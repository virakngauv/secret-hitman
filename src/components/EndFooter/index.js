import { Button, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { playAgain, kickPlayer } from "../../api";

function EndFooter(props) {
  const setGameState = props.setGameState;
  const playerID = sessionStorage.getItem("playerID");
  const history = useHistory();

  // // Probably should put them back into lobby
  // const markPlayAgain = () => console.log("Wants to play again!");
  function handlePlayAgain () {
    playAgain(setGameState);
  }

  // TODO: make into normal function
    const leaveGame = () => {
    console.log("Leaving game!");
    kickPlayer(playerID);
    history.push("/");
  }

  return (
    <>
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={handlePlayAgain} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-1">
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
