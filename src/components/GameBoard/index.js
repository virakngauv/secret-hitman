import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";

function GameBoard(props) {
  const words = props.words;
  const isEnabled = props.isEnabled;
  const setWords = props.setWords;

  function updateWord(wordIndex) {
    if (words.length > wordIndex) {
      const newWords = [...words];
      newWords[wordIndex] = {text: "chair", type: "civilian", claimer: "Alfred"};

      setWords(newWords);
      console.log("I should have just setWords()");
    }
  }

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {words.map((word, index) => (
        <GameBoardTile word={word} index={index} updateWord={updateWord} isEnabled={isEnabled} />))}
    </Row>
  );
}

export default GameBoard;
  