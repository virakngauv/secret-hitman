import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "./index.css";

function GameBoardTile(props) {
  const word = props.word.text;
  const type = props.word.type;
  const claimer = props.word.claimer;

  const isForceDisabled = props.isForceDisabled;
  const [isDisabled, setIsDisabled] = useState(isForceDisabled);

  // const index = props.index;
  const updateThisWord = props.updateThisWord;

  function handleTileClick () {
    setIsDisabled(true);
    
    // "updateWord() will eventually make an API call"
    updateThisWord();
  }

  // TODO: Import Type Enum after making it
  const Type = {
    target: "target", 
    civilian: "civilian", 
    assassin: "assassin"
  };

  const tileClassName = isForceDisabled ? "game-board-tile game-board-tile-force-disabled" : "game-board-tile";

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

  return (
    <Col>
      <Button
        className={tileClassName}
        variant={buttonVariant}
        disabled={isDisabled || type}
        onClick={handleTileClick}
      >
        <div className="game-board-tile-text text-uppercase">{word}</div>
        {claimer && <div className="game-board-tile-claimer">{claimer}</div>}
      </Button>
    </Col>
  );
}

export default GameBoardTile;
  