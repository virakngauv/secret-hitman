import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "./index.css";

function GameBoardTile(props) {
  const word = props.word.text;
  const type = props.word.type;
  const claimer = props.word.claimer;

  const initIsEnabled = props.isEnabled;
  const [isEnabled, setIsEnabled] = useState(initIsEnabled);

  const index = props.index;
  const updateWord = props.updateWord;

  // TODO: Import Type Enum after making it
  const Type = {
    target: "target", 
    civilian: "civilian", 
    assassin: "assassin"
  };

  let buttonVariant = "";
  if (type === Type.target) {
    buttonVariant = "success";
  } else if (type === Type.civilian) {
    buttonVariant = "light";
  } else if (type === Type.assassin) {
    buttonVariant = "dark";
  } else {
    buttonVariant = "outline-secondary";
  }

  function handleTileClick () {
    setIsEnabled(false);

    updateWord(index);
  }

  return (
    <Col>
      <Button
        className="game-board-tile"
        variant={buttonVariant}
        disabled={!isEnabled}
        onClick={handleTileClick}
      >
        <div className="game-board-tile-text text-uppercase">{word}</div>
        {claimer && <div className="game-board-tile-claimer">{claimer}</div>}
      </Button>
    </Col>
  );
}

export default GameBoardTile;
  