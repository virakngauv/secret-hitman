import { Col, Row } from "react-bootstrap";
import "./index.css";

function GameInfo(props) {
  const roomCode = props.roomCode;
  const roundInfo = props.roundInfo;

  return (
    <>
      <Row className="game-info">
        <Col className="d-flex">
          <div className="fs-sm ms-auto me-3">
            <b>Room:</b> {`${roomCode}`}
          </div>
        </Col>
        {roundInfo.length === 2 && 
          <Col className="d-flex">
            <div className="fs-sm ms-3 me-auto">
              <b>Round:</b>  {`${roundInfo[0]}/${roundInfo[1]}`}
            </div>
          </Col>}
      </Row>
    </>
  );
}
  
export default GameInfo;
