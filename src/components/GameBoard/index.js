import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";

function GameBoard(props) {
  const words = props.words;
  const enabled = props.enabled;

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {words.map((word) => (
        <GameBoardTile word={word} enabled={enabled} />))}
    </Row>
  );
}

export default GameBoard;
  