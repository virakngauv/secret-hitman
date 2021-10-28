// import { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { endGame, startNextTurn, pauseTimer, getGameState } from "../../api";

// // TODO: Make enum for PlayerStatus
// const PlayerStatus = {
//   ACTIVE: "active",
//   INACTIVE: "inactive", 
//   CODEMASTER: "codemaster",
// };

function GameFooterEnd(props) {
  const timerTime = props.timerTime;
  const timerID = props.timerID;
  const roundInfo = props.roundInfo;
  const setGameState = props.setGameState;

  const roomCode = sessionStorage.getItem("roomCode");

  const [isLastTurn, isLastRound] = (() => {
    if (roundInfo.length !== 4) {
      return [false, false];
    }

    if (roundInfo[1] === 0 || roundInfo[3] === 0) {
      return [false, false];
    }

    const isLastTurn = roundInfo[0] === roundInfo[1];
    const isLastRound = roundInfo[2] === roundInfo[3];

    return [isLastTurn, isLastRound];
  })();

  function handleNextTurn() {
    if (isLastTurn && isLastRound) {
      endGame();
      getGameState(roomCode, setGameState);
    } else {
      // Either from hitting Next Turn button or from Restart Timer button
      startNextTurn();
    }
  }

  function handlePauseTimer() {
    pauseTimer();
    // setTimerIsPaused(true);
  }

  // const allPlayersReady = players.reduce(
  //   (readyStatusSoFar, currentPlayer) => {
  //     return readyStatusSoFar && currentPlayer.status === PlayerStatus.ACTIVE
  //   }, true
  // );

  // if (!playerCanSeeBoard) {
  //   return (
  //     <Row>
  //       <Col className="d-flex">
  //         <Button className="btn-menu btn-game-footer ms-auto me-auto" size="sm" variant="outline-secondary" id="reveal-board-button" key="reveal-board-button" onClick={handleRevealBoard}>
  //           Reveal Tiles
  //         </Button>
  //       </Col>
  //     </Row>
  //   )
  // } else if (!isActive) {
  //   return (
  //     <Row>
  //       <Col className="d-flex">
  //         <Button className="btn-menu btn-game-footer ms-auto me-auto" size="sm" variant="outline-secondary" id="end-turn-button" key="end-turn-button" onClick={toggleReadyStatus}>
  //           I'm Ready!
  //         </Button>
  //       </Col>
  //     </Row>
  //   )
  // } else {

  if (timerTime === null) {
    return (
      <Row>
        <Col className="d-flex">
          <Button className="btn-menu btn-game-footer ms-auto me-auto" size="sm" variant="outline-secondary" id="next-turn-button" key="next-turn-button" onClick={handleNextTurn}>
            Let's Go!
          </Button>
        </Col>
      </Row>
    )
  } else if (timerID) {
    return (
      <Row>
        <Col className="d-flex">
          <Button className="btn-menu btn-game-footer ms-auto me-auto" size="sm" variant="outline-secondary" id="pause-timer-button" key="pause-timer-button" onClick={handlePauseTimer}>
            Pause Timer
          </Button>
        </Col>
      </Row>
    )
  } else {
    return (
      <Row>
        <Col className="d-flex">
          <Button className="btn-menu btn-game-footer ms-auto me-auto" size="sm" variant="outline-secondary" id="restart-timer-button" key="restart-timer-button" onClick={handleNextTurn}>
            Restart Timer
          </Button>
        </Col>
      </Row>
    )
  }
    
  // }
}
  
export default GameFooterEnd;
