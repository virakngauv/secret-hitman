import CardGroup from "react-bootstrap/CardGroup";
import PlayerRosterCard from "../PlayerRosterCard";
import "./index.css"

function PlayerRoster(props) {
  const players = props.players;
  const playerCardHeadings = {status: "Status", name: "Name", score: "Score"}

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
