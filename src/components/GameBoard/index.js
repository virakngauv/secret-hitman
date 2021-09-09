import { useState } from "react";
import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";
import Type from "../../constants/type.js";
import State from "../../constants/state";

function GameBoard(props) {
  const tiles = props.tiles;
  const isForceDisabled = props.isForceDisabled;
  const setTiles = props.setTiles;
  const setIsForceDisabled = props.setIsForceDisabled;

  // const [isGameBoardDisabled, setIsGameBoardDisabled] = useState(false);

  function updateTile(tileIndex) {
    if (tiles.length > tileIndex) {
      let newTiles = [...tiles];
      
      newTiles[tileIndex].type = Type.CIVILIAN;
      newTiles[tileIndex].claimer = "Alfred";
      newTiles[tileIndex].state = State.DISABLED_OPAQUE;

      if ([Type.CIVILIAN, Type.ASSASSIN].includes(newTiles[tileIndex].type)) {
        // setIsGameBoardDisabled(true);

        newTiles.forEach((tile) => {
          if (tile.state === State.ENABLED) {
            tile.state = State.DISABLED_TRANSPARENT;
          }
        })
      }

      setTiles(newTiles);
    }
  }

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {tiles.map((tile, index) => {
        const updateThisTile = () => {updateTile(index)};

        return <GameBoardTile tile={tile} updateThisTile={updateThisTile} />
      })}
    </Row>
  );
}

export default GameBoard;
  