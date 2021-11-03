import GameFooterCodemaster from "../GameFooterCodemaster";
import GameFooterHitman from "../GameFooterHitman";
import GameFooterEnd from "../GameFooterEnd";
import "./index.css";

const RoundPhase = {
  HINT: "hint",
  GUESS: "guess",
};

function GameFooter(props) {
  const roomCode = props.roomCode;
  const isCodemaster = props.isCodemaster;
  const isInactive = props.isInactive;
  // const isActive = props.isActive;
  const isTurnPausedOrEnded = props.isTurnPausedOrEnded;
  const hint = props.hint;
  const setTiles = props.setTiles;
  // const playerCanSeeBoard = props.playerCanSeeBoard;
  // const setPlayerCanSeeBoard = props.setPlayerCanSeeBoard;
  // const players = props.players;
  // const setMessages = props.setMessages;
  const roundPhase = props.roundPhase;
  const timerTime = props.timerTime;
  const timerID = props.timerID;
  const roundInfo = props.roundInfo;
  const setGameState = props.setGameState;

  if (isTurnPausedOrEnded) {
    return <GameFooterEnd timerTime={timerTime} timerID={timerID} roundInfo={roundInfo} setGameState={setGameState} />
  } else if (roundPhase === RoundPhase.HINT) {
    return <GameFooterCodemaster roomCode={roomCode} hint={hint} />
  } else if (roundPhase === RoundPhase.GUESS) {
    if (isCodemaster) {
      return null;
    } else {
      return <GameFooterHitman isInactive={isInactive} setTiles={setTiles} />
    }
  } else {
    // Should not be reachable
    return null;
  }
}

export default GameFooter;
