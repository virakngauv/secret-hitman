import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { invalidateHint } from "../../api";

function GameFooterHitman(props) {
  const hint = props.hint;
  const isHintEmpty = hint === "" ? true : false;

  function handleInvalidateHint() {
    invalidateHint();
  }

  return (
    <ButtonGroup className="game-footer ms-auto me-auto d-flex" size="sm">
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="report-invalid-hint-button" onClick={handleInvalidateHint} disabled={isHintEmpty}>Invalid Hint</Button>
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="end-turn-button">End Turn</Button>
    </ButtonGroup>
  );
}
  
export default GameFooterHitman;
