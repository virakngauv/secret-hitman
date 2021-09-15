import GameFooterClue from "../GameFooterClue";
import GameFooterGuesser from "../GameFooterGuesser";
import "./index.css";

function GameFooter(props) {
  const isCodemaster = props.isCodemaster;

  return (
    isCodemaster ? <GameFooterClue /> : <GameFooterGuesser />
  );
}

export default GameFooter;
