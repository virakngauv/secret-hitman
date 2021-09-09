import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "./index.css";

import { Type } from "../../constants/type.js";

function GameBoardTile(props) {
  const word = props.tile.word;
  const type = props.word.type;
  const claimer = props.word.claimer;

  const isForceDisabled = props.isForceDisabled;
  const [isDisabled, setIsDisabled] = useState(isForceDisabled);

  const isGameBoardDisabled = props.isGameBoardDisabled;

  // const index = props.index;
  const updateThisTile = props.updateThisTile;

  function handleTileClick () {
    setIsDisabled(true);
    
    // "updateWord() will eventually make an API call"
    updateThisTile();
  } 

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
        disabled={isGameBoardDisabled || isDisabled || claimer}
        onClick={handleTileClick}
      >
        <div className="game-board-tile-text text-uppercase">{word}</div>
        {claimer && <div className="game-board-tile-claimer">{claimer}</div>}
      </Button>
    </Col>
  );
}

export default GameBoardTile;
  