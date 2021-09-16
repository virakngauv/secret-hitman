import { Col, Row, Table } from "react-bootstrap";
import StatusIndicator from "../StatusIndicator";
import "./index.css";

function LobbyRoster(props) {
  const players = props.players;

  return (
    <Row>
      <Col className="d-flex">
        <Table borderless hover size="sm" className="fs-sm ms-auto me-auto lobby-roster">
          <thead>
            <tr>
              <th className="text-center col-6">Status</th>
              <th className="col-6">Name</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              return (
                <tr>
                  <td className="text-center"><StatusIndicator status={player.status} /></td>
                  <td>{player.name}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default LobbyRoster;
