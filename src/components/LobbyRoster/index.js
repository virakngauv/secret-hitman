import { Col, Row, Table } from "react-bootstrap";
import StatusIndicator from "../StatusIndicator";
import XEmoji from "../XEmoji";
import "./index.css";
import { kickPlayer } from "../../api";

function LobbyRoster(props) {
  const players = props.players;
  const playerID = sessionStorage.getItem("playerID");

  function handleKickPlayer(playerID) {
    console.log("I am in handleKickPlayer");
    kickPlayer(playerID);
  }

  return (
    <Row>
      <Col className="d-flex">
        <Table borderless hover size="sm" className="fs-sm ms-auto me-auto lobby-roster">
          <thead>
            <tr>
              <th className="text-center col-3">Status</th>
              <th className="text-center col-6">Name</th>
              <th className="text-center col-3">Kick</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              return (
                <tr>
                  <td className="text-center"><StatusIndicator status={player.status} /></td>
                  <td className="text-center">{player.name}</td>
                  <td className="text-center">
                    {playerID === player.id || <XEmoji kickPlayer={() => handleKickPlayer(player.id)} />}
                  </td>
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
