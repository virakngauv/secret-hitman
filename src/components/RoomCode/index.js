import { Col, Row } from "react-bootstrap";

function RoomCode(props) {
  const roomCode = props.roomCode;

  return (
    <>
      <Row>
        <Col className="d-flex">
          <div className="fs-sm ms-auto me-auto">
            <b>Room Code</b>
          </div>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="d-flex">
          <div className="fs-sm ms-auto me-auto">
            {roomCode}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default RoomCode;
