import Card from "react-bootstrap/Card";
import StatusIndicator from "../StatusIndicator";
import "./index.css";

function PlayerRosterCard(props) {
  const player = props.player;

  return (
    // <Card border="light" className="player-card text-center">
    <Card className="player-card text-center shadow-sm">
      <Card.Header>
        <StatusIndicator status={player.status} />
        <div className="player-name">{player.name}</div>
      </Card.Header>
      <Card.Body>{player.oldScore + player.newScore}</Card.Body>
    </Card>
  );
}

export default PlayerRosterCard;
