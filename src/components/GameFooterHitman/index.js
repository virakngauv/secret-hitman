import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { endPlayerTurn, invalidateHint } from "../../api";

function GameFooterHitman(props) {
  const isInactive = props.isInactive;
  const hint = props.hint;
  const isHintEmpty = hint === "" ? true : false;
  const setTiles = props.setTiles;

  function handleInvalidateHint() {
    invalidateHint();
  }

  function handleEndTurn() {
    endPlayerTurn(setTiles);
  }

  return (
    <ButtonGroup className="game-footer ms-auto me-auto d-flex" size="sm">
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="report-invalid-hint-button" onClick={handleInvalidateHint} disabled={isHintEmpty || isInactive}>Invalid Hint</Button>
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="end-turn-button" onClick={handleEndTurn} disabled={isInactive}>End Turn</Button>
    </ButtonGroup>
  );
}
  
export default GameFooterHitman;
