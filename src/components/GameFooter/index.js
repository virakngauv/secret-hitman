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
  const isActive = props.isActive;
  const isTurnEnded = props.isTurnEnded;
  const hint = props.hint;
  const setTiles = props.setTiles;
  const playerCanSeeBoard = props.playerCanSeeBoard;
  const setPlayerCanSeeBoard = props.setPlayerCanSeeBoard;
  const players = props.players;
  const setMessages = props.setMessages;
  const roundPhase = props.roundPhase;

  if (isTurnEnded) {
    return <GameFooterEnd isCodemaster={isCodemaster} isActive={isActive} setTiles={setTiles} playerCanSeeBoard={playerCanSeeBoard} setPlayerCanSeeBoard={setPlayerCanSeeBoard} players={players} setMessages={setMessages} />
  } else if (isCodemaster) {
    if (roundPhase === RoundPhase.HINT) {
      return <GameFooterCodemaster roomCode={roomCode} hint={hint} />
    } else {
      return null;
    }
  } else {
    return <GameFooterHitman isInactive={isInactive} hint={hint} setTiles={setTiles} />
  }
}

export default GameFooter;
