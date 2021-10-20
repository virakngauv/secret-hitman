import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { kickPlayer } from "../../api";
import StatusIndicator from "../StatusIndicator";
import "./index.css";

function PlayerRosterCard(props) {
  const player = props.player;

  function handleKickPlayer() {
    kickPlayer(player.id);
  }

  const kickPopover = (
    <Popover id={`kick-popover-${player.id}`}>
      <Popover.Body>
        <Button onClick={handleKickPlayer} variant="outline-secondary" size="sm" className="btn-menu text-uppercase">
          {`kick ${player.name}`}
        </Button>
      </Popover.Body>
    </Popover>
  )

  return (
    // <Card border="light" className="player-card text-center">
    <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={kickPopover}>
      <Card className="player-card text-center shadow-sm">
        <Card.Header>
          <StatusIndicator status={player.status} />
          <div className="player-name">{player.name}</div>
        </Card.Header>
        <Card.Body>{player.oldScore + player.newScore}</Card.Body>
      </Card>
    </OverlayTrigger>

  );
}

export default PlayerRosterCard;
