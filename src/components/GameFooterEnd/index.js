import { Row, Col, ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { getPlayerCanSeeBoard, getMessages, markPlayerStatus, revealBoard, startNextTurn } from "../../api";

// TODO: Make enum for PlayerStatus
const PlayerStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive", 
  CODEMASTER: "codemaster",
};

function GameFooterEnd(props) {
  const isCodemaster = props.isCodemaster;
  const isActive = props.isActive;
  const setTiles = props.setTiles;
  const playerCanSeeBoard = props.playerCanSeeBoard;
  const setPlayerCanSeeBoard = props.setPlayerCanSeeBoard;
  const players = props.players;
  const setMessages = props.setMessages;
  // const isInactive = props.isInactive;
  // const hint = props.hint;
  // const isHintEmpty = hint === "" ? true : false;

  function handleRevealBoard() {
    revealBoard(setTiles);
    getPlayerCanSeeBoard(setPlayerCanSeeBoard);
    getMessages(setMessages);
  }

  function toggleReadyStatus() {
    if (isActive) {
      markPlayerStatus(PlayerStatus.INACTIVE);
    } else if (!isActive) {
      markPlayerStatus(PlayerStatus.ACTIVE);
    }

    getMessages(setMessages);
  }

  function handleNextTurn() {
    console.log(`Next Turn API Call~`);
    startNextTurn();
  }

  const allPlayersReady = players.reduce(
    (readyStatusSoFar, currentPlayer) => {
      return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
    }, true
  );

  if (!playerCanSeeBoard) {
    return (
      <Row>
        <Col className="d-flex">
          <Button className="btn-menu ms-auto me-auto" size="sm" variant="outline-secondary" id="reveal-board-button" onClick={handleRevealBoard}>
            Reveal Tiles
          </Button>
        </Col>
      </Row>
    )
  } else if (!isActive) {
    return (
      <Row>
        <Col className="d-flex">
          <Button className="btn-menu ms-auto me-auto" size="sm" variant="outline-secondary" id="end-turn-button" onClick={toggleReadyStatus}>
            I'm Ready!
          </Button>
        </Col>
      </Row>
    )
  } else {
    return (
      <Row>
        <Col className="d-flex">
          <Button className="btn-menu ms-auto me-auto" size="sm" variant="outline-secondary" id="next-turn-button" onClick={handleNextTurn} disabled={!allPlayersReady}>
            Next Turn
          </Button>
        </Col>
      </Row>

    )
  }
}
  
export default GameFooterEnd;
