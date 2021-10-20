import { Button, OverlayTrigger, Popover } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { kickPlayer } from "../../api";
import StatusIndicator from "../StatusIndicator";
import "./index.css";

function PlayerRosterCard(props) {
  const player = props.player;
  const playerID = sessionStorage.getItem("playerID");

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
  );

  const playerRosterCard = (
    <Card className="player-card text-center shadow-sm">
      <Card.Header>
        <StatusIndicator status={player.status} />
        <div className="player-name">{player.name}</div>
      </Card.Header>
      <Card.Body>{player.oldScore + player.newScore}</Card.Body>
    </Card>
  );

  if (player.id === playerID) {
    return (
      playerRosterCard
    )
  } else {
    return (
      <OverlayTrigger trigger="click" rootClose placement="bottom" overlay={kickPopover}>
        {playerRosterCard}
      </OverlayTrigger>
    )

  }
}

export default PlayerRosterCard;
