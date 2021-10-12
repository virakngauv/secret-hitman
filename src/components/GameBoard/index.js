import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";
import Type from "../../constants/type.js";
import State from "../../constants/state";

function GameBoard(props) {
  const roomCode = props.roomCode;
  const tiles = props.tiles;

  // // Now down in the server
  // // Format tiles
  // if (isCodemaster) {
  //   tiles.forEach(tile => {
  //     tile.state = State.DISABLED_OPAQUE;
  //   })
  // }

  // function updateTile(tileIndex) {
  //   if (tiles.length > tileIndex) {
  //     let newTiles = [...tiles];
      
  //     newTiles[tileIndex].type = Type.CIVILIAN;
  //     newTiles[tileIndex].claimer = "Alfred";
  //     newTiles[tileIndex].state = State.DISABLED_OPAQUE;

  //     if ([Type.CIVILIAN, Type.ASSASSIN].includes(newTiles[tileIndex].type)) {

  //       newTiles.forEach((tile) => {
  //         if (tile.state === State.ENABLED) {
  //           tile.state = State.DISABLED_TRANSPARENT;
  //         }
  //       })
  //     }

  //     setTiles(newTiles);
  //   }
  // }

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {tiles.map((tile, index) => {
        // const updateThisTile = () => {updateTile(index)};

        return <GameBoardTile roomCode={roomCode} tile={tile} tileIndex={index} />
      })}
    </Row>
  );
}

export default GameBoard;
