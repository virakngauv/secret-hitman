import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";

function GameBoard(props) {
  const words = props.words;
  const isForceDisabled = props.isForceDisabled;
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
      {words.map((word, index) => {
        const updateThisWord = () => {updateWord(index)};

        return <GameBoardTile word={word} updateThisWord={updateThisWord} isForceDisabled={isForceDisabled} />
      })}
    </Row>
  );
}

export default GameBoard;
  