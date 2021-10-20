import GameFooterCodemaster from "../GameFooterCodemaster";
import GameFooterHitman from "../GameFooterHitman";
import GameFooterEnd from "../GameFooterEnd";
import "./index.css";

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

  if (isTurnEnded) {
    return <GameFooterEnd isCodemaster={isCodemaster} isActive={isActive} setTiles={setTiles} playerCanSeeBoard={playerCanSeeBoard} setPlayerCanSeeBoard={setPlayerCanSeeBoard} players={players} />
  } else if (isCodemaster) {
    return <GameFooterCodemaster roomCode={roomCode} hint={hint} />
  } else {
    return <GameFooterHitman isInactive={isInactive} hint={hint} setTiles={setTiles} />
  }
}

export default GameFooter;
