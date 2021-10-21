import CardGroup from "react-bootstrap/CardGroup";
import PlayerRosterCard from "../PlayerRosterCard";
import "./index.css"

// TODO: rename PlayerRoster to GameRoster and PlayerRosterCard to GameRosterCard

function PlayerRoster(props) {
  const players = props.players;
  // Putting playerID into the heading is a hack to prevent trying to "kick" the heading card
  const playerID = sessionStorage.getItem("playerID");
  const playerCardHeadings = {id: playerID, status: "Status", name: "Name", oldScore: "Score", newScore: ""};

  return (
    <CardGroup className="player-roster ms-auto me-auto">
      <PlayerRosterCard player={playerCardHeadings} />
      {players && players.map((player) => (
        <PlayerRosterCard player={player} />
      ))}
    </CardGroup>
  );
}

export default PlayerRoster;
