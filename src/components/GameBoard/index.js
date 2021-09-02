import Row from "react-bootstrap/Row";
import GameBoardTile from "../GameBoardTile";
import "./index.css";

function GameBoard(props) {
  const words = props.words;
  const isEnabled = props.isEnabled;

  return (
    <Row className="game-board justify-content-center ms-auto me-auto">
      {words.map((word) => (
        <GameBoardTile word={word} isEnabled={isEnabled} />))}
    </Row>
  );
}

export default GameBoard;
  