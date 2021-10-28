import { Col, Row } from "react-bootstrap";
import "./index.css";

function GameInfo(props) {
  const roomCode = props.roomCode;
  const roundInfo = props.roundInfo;

  return (
    <>
      <Row className="game-info">
        <Col className="d-flex">
          <div className="fs-sm ms-auto me-1">
            <b>Room:</b> {`${roomCode}`}
          </div>
        </Col>
        {roundInfo.length === 4 &&
          <>
            <Col className="d-flex">
              <div className="fs-sm ms-auto me-auto">
                <b>Turn:</b>  {`${roundInfo[0]}/${roundInfo[1]}`}
              </div>
            </Col>
            <Col className="d-flex">
              <div className="fs-sm ms-1 me-auto">
                <b>Round:</b>  {`${roundInfo[2]}/${roundInfo[3]}`}
              </div>
            </Col>
          </>
        }
      </Row>
    </>
  );
}
  
export default GameInfo;
