import { Button, Col, Row } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { markPlayerStatus, startGame } from "../../api";

function LobbyFooter(props) {
  console.log("LOBBY FOOTER WAS LOADED");

  const PlayerStatus = {
    ACTIVE: "active",
    INACTIVE: "inactive",
    CODEMASTER: "codemaster",
  }

  const roomCode = props.roomCode;
  const players = props.players;
  const playerID = sessionStorage.getItem("playerID");
  // console.log(`players is ${JSON.stringify(players, null, 2)}`);
  // console.log(`playerID is ${playerID}`);
  const self = players.find(player => player.id === playerID);
  const isReady = self?.status === PlayerStatus.ACTIVE ? true : false;

  const history = useHistory();
  const goBack = () => history.goBack();

  function toggleReadyStatus() {
    if (isReady) {
      markPlayerStatus(PlayerStatus.INACTIVE);
    } else if (!isReady) {
      markPlayerStatus(PlayerStatus.ACTIVE);
    }
  }

  function handleStartGame() {
    console.log("inside handleStartGame")
    startGame(roomCode);
  }

  // const startGame = () => console.log("Start Game!")
  const allPlayersReady = players.reduce(
    (readyStatusSoFar, currentPlayer) => {
      return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
    }, true);

  return (
    <>
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={toggleReadyStatus} variant="outline-secondary" size="sm" className="btn-menu ms-auto me-1" id={`toggle-ready-button-${isReady}`} key={`toggle-ready-button-${isReady}`}>
            {!isReady ? "I'm Ready!" : "Not Ready"}
          </Button>
          <Button disabled={!allPlayersReady} onClick={handleStartGame} variant="outline-secondary" size="sm" className="btn-menu ms-1 me-auto">
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
