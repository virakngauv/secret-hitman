import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";

function GameBoard(props) {
  const tiles = props.tiles;

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {tiles.map((tile, index) => {
        return <GameBoardTile tile={tile} tileIndex={index} />
      })}
    </Row>
  );
}

export default GameBoard;
