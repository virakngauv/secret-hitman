import { useState } from "react";
import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";

function GameBoard(props) {
  const words = props.words;
  const isForceDisabled = props.isForceDisabled;
  const setWords = props.setWords;
  const setIsForceDisabled = props.setIsForceDisabled;

  const [isGameBoardDisabled, setIsGameBoardDisabled] = useState(false);

  function updateTile(wordIndex) {
    if (words.length > wordIndex) {
      const newWords = [...words];
      
      newWords[wordIndex].type = "target";
      newWords[wordIndex].claimer = "Alfred";

      setWords(newWords);

      if (["civilian", "assassin"].includes(newWords[wordIndex].type)) {
        setIsGameBoardDisabled(true);
      }
    }
  }

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {words.map((word, index) => {
        const updateThisTile = () => {updateTile(index)};

        return <GameBoardTile word={word} updateThisTile={updateThisTile} isForceDisabled={isForceDisabled} isGameBoardDisabled={isGameBoardDisabled} />
      })}
    </Row>
  );
}

export default GameBoard;
  