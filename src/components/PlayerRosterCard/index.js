import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import StatusIndicator from "../StatusIndicator";
import "./index.css";

function PlayerRosterCard(props) {
  const player = props.player;

  // const codemaster = "text-white bg-dark";
  // const active = "bg-success";
  // const inactive = "bg-warning";
  // const themes = [codemaster, active, inactive];
  // const randomThemeIndex = Math.floor(Math.random() * themes.length);
  // const randomTheme =themes[randomThemeIndex];

  // const themeMap = {
  //   codemaster,
  //   active,
  //   inactive
  // }

  return (
    <Card border="light" className="player-card text-center">
      <Card.Header>
        <StatusIndicator status={player.status} />
        <div className="player-name">{player.name}</div>
      </Card.Header>
      <Card.Body>{player.score}</Card.Body>
    </Card>
  );
}
  
export default PlayerRosterCard;
