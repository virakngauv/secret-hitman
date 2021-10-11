import GameFooterClue from "../GameFooterClue";
import GameFooterGuesser from "../GameFooterGuesser";
import "./index.css";

function GameFooter(props) {
  const isCodemaster = props.isCodemaster;
  const hint = props.hint;

  return (
    isCodemaster ? <GameFooterClue /> : <GameFooterGuesser hint={hint} />
  );
}

export default GameFooter;
