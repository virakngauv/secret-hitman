import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function GameFooterGuesser(props) {
  const hint = props.hint;
  const isHintEmpty = hint === "" ? true : false;

  return (
    <ButtonGroup className="game-footer ms-auto me-auto d-flex" size="sm">
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="report-invalid-hint-button" disabled={isHintEmpty}>Invalid Hint</Button>
      <Button className="btn-menu" size="sm" variant="outline-secondary" id="end-turn-button">End Turn</Button>
    </ButtonGroup>
  );
}
  
export default GameFooterGuesser;
