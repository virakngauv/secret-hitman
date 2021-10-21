import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { getPlayerCanSeeBoard, markPlayerStatus, revealBoard, startNextTurn } from "../../api";

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
  // const isInactive = props.isInactive;
  // const hint = props.hint;
  // const isHintEmpty = hint === "" ? true : false;

  function handleRevealBoard() {
    revealBoard(setTiles);
    getPlayerCanSeeBoard(setPlayerCanSeeBoard);
  }

  function toggleReadyStatus() {
    if (isActive) {
      markPlayerStatus(PlayerStatus.INACTIVE);
    } else if (!isActive) {
      markPlayerStatus(PlayerStatus.ACTIVE);
    }
  }

  function handleNextTurn() {
    console.log(`Next Turn API Call~`);
    startNextTurn();
  }

  const allPlayersReady = players.reduce(
    (readyStatusSoFar, currentPlayer) => {
      return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
    }, true);

  return (
    <ButtonGroup className="game-footer ms-auto me-auto d-flex" size="sm">
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="reveal-board-button" onClick={handleRevealBoard} disabled={playerCanSeeBoard}>Reveal Tiles</Button>
      {!isActive ? 
        <Button className="btn-menu" size="sm" variant="outline-secondary" id="end-turn-button" onClick={toggleReadyStatus}>I'm Ready!</Button> :
        <Button className="btn-menu" size="sm" variant="outline-secondary" id="next-turn-button" onClick={handleNextTurn} disabled={!allPlayersReady}>Next Turn</Button>}
    </ButtonGroup>
  );
}
  
export default GameFooterEnd;
