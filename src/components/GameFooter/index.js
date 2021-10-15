import GameFooterCodemaster from "../GameFooterCodemaster";
import GameFooterHitman from "../GameFooterHitman";
import "./index.css";

function GameFooter(props) {
  const roomCode = props.roomCode;
  const isCodemaster = props.isCodemaster;
  const hint = props.hint;

  return (
    isCodemaster ? <GameFooterCodemaster roomCode={roomCode} hint={hint} /> : <GameFooterHitman hint={hint} />
  );
}

export default GameFooter;
