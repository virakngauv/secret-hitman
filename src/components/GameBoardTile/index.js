import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "./index.css";

function GameBoardTile(props) {
  const word = props.word;

  const [show, toggleShow] = useState(true);

  return (
    <Col>
      <Button
        className="game-board-tile"
        variant="outline-secondary"
        onClick={() => toggleShow(!show)}
      >
        <div className="game-board-tile-text text-uppercase">{word.text}</div>
        {show && <div className="game-board-tile-claimer">{word.claimer}</div>}
      </Button>
    </Col>
  );
}

export default GameBoardTile;
  