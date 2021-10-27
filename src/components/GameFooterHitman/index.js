import { Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { endPlayerTurn } from "../../api";

function GameFooterHitman(props) {
  const isInactive = props.isInactive;
  // const hint = props.hint;
  // const isHintEmpty = hint === "" ? true : false;
  const setTiles = props.setTiles;

  // function handleInvalidateHint() {
  //   invalidateHint();
  // }

  function handleFinishTurn() {
    endPlayerTurn(setTiles);
  }

  return (
    <Row>
      <Col className="d-flex">
        {/* <Button className="btn-menu btn-game-footer ms-auto me-1" size="sm" variant="outline-secondary" id="report-invalid-hint-button" onClick={handleInvalidateHint} disabled={isHintEmpty || isInactive}>Invalid Hint</Button> */}
        <Button className="btn-menu btn-game-footer ms-1 me-auto" size="sm" variant="outline-secondary" id="end-turn-button" onClick={handleFinishTurn} disabled={isInactive}>Finish Turn</Button>
      </Col>
    </Row>
  );
}
  
export default GameFooterHitman;
