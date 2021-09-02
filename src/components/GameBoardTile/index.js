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

  return (
    <Col>
      <Button
        className="game-board-tile"
        variant="outline-secondary"
        disabled={!isEnabled}
        onClick={() => setIsEnabled(false)}
      >
        <div className="game-board-tile-text text-uppercase">{word}</div>
        {claimer && <div className="game-board-tile-claimer">{claimer}</div>}
      </Button>
    </Col>
  );
}

export default GameBoardTile;
  