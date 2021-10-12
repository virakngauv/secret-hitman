import CardGroup from "react-bootstrap/CardGroup";
import PlayerRosterCard from "../PlayerRosterCard";
import "./index.css"

// TODO: rename PlayerRoster to GameRoster and PlayerRosterCard to GameRosterCard

function PlayerRoster(props) {
  const players = props.players;
  const playerCardHeadings = {status: "Status", name: "Name", oldScore: "Score", newScore: ""}

  return (
    <CardGroup className="player-roster">
      <PlayerRosterCard player={playerCardHeadings} />
      {players && players.map((player) => (
        <PlayerRosterCard player={player} />
      ))}
    </CardGroup>
  );
}

export default PlayerRoster;
