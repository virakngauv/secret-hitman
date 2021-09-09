import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "./index.css";

import Type from "../../constants/type.js";
import State from "../../constants/state.js";

function GameBoardTile(props) {
  const word = props.tile.word;
  const type = props.tile.type;
  const claimer = props.tile.claimer;
  const state = props.tile.state;

  // const isForceDisabled = props.isForceDisabled;
  // const [isDisabled, setIsDisabled] = useState(isForceDisabled);

  const isGameBoardDisabled = props.isGameBoardDisabled;

  // const index = props.index;
  const updateThisTile = props.updateThisTile;

  function handleTileClick () {
    // setIsDisabled(true);
    
    // "updateThisTile() will eventually make an API call"
    updateThisTile();
  } 

  const tileClassName = state === State.DISABLED_OPAQUE ? "game-board-tile game-board-tile-disabled-opaque" : "game-board-tile";

  let buttonVariant = "";
  if (type === Type.TARGET) {
    buttonVariant = "success";
  } else if (type === Type.CIVILIAN) {
    buttonVariant = "light";
  } else if (type === Type.ASSASSIN) {
    buttonVariant = "dark";
  } else {
    buttonVariant = "outline-secondary";
  }

  return (
    <Col>
      <Button
        className={tileClassName}
        variant={buttonVariant}
        disabled={state === State.DISABLED_OPAQUE || state === State.DISABLED_TRANSPARENT || isGameBoardDisabled}
        onClick={handleTileClick}
      >
        <div className="game-board-tile-text text-uppercase">{word}</div>
        {claimer && <div className="game-board-tile-claimer">{claimer}</div>}
      </Button>
    </Col>
  );
}

export default GameBoardTile;
  