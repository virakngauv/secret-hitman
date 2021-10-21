import { Col, Row, Table } from "react-bootstrap";
import RankEmoji from "../RankEmoji";
import "./index.css";

function EndRoster(props) {
  const players = props.players;
  // TODO: move sorting and rank into utilities
  players.sort((a, b) => b.oldScore - a.oldScore);
  console.log("Players should be ranked")
  console.log(JSON.stringify(players));
  
  let rank = [1, 2, 3];
  for (let i = 0; i < players.length && i < rank.length; i++) {
    players[i].rank = rank[i];
  }
  console.log("Players should have generic 1,2,3 ranks")
  console.log(JSON.stringify(players));

  for (let i = 1; i < players.length; i++) {
    if (players[i-1].oldScore === players[i].oldScore) {
      players[i].rank = players[i-1].rank;
    }
  }
  console.log("Players should have actual 1,2,3 ranks with ties")
  console.log(JSON.stringify(players));


  return (
    <Row>
      <Col className="d-flex">
        <Table borderless hover size="sm" className="fs-sm ms-auto me-auto end-roster">
          <thead>
            <tr>
              <th className="text-center col-4">Rank</th>
              <th className="col-4">Name</th>
              <th className="text-center col-4">Score</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => {
              return (
                <tr>
                  <td className="text-center"><RankEmoji rank={player.rank} /></td>
                  <td>{player.name}</td>
                  <td className="text-center">{player.oldScore}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
      </Col>
    </Row>
  )
}

export default EndRoster;
