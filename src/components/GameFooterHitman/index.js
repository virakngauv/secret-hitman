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

  function handleFinishTurn() {
    endPlayerTurn(setTiles);
  }

  return (
    <ButtonGroup className="game-footer ms-auto me-auto d-flex" size="sm">
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="report-invalid-hint-button" onClick={handleInvalidateHint} disabled={isHintEmpty || isInactive}>Invalid Hint</Button>
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="end-turn-button" onClick={handleFinishTurn} disabled={isInactive}>Finish Turn</Button>
    </ButtonGroup>
  );
}
  
export default GameFooterHitman;
