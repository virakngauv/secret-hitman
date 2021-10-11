import GameFooterClue from "../GameFooterClue";
import GameFooterGuesser from "../GameFooterGuesser";
import "./index.css";

function GameFooter(props) {
  const roomCode = props.roomCode;
  const isCodemaster = props.isCodemaster;
  const hint = props.hint;

  return (
    isCodemaster ? <GameFooterClue roomCode={roomCode} hint={hint} /> : <GameFooterGuesser hint={hint} />
  );
}

export default GameFooter;
