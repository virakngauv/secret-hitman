import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import GameFooter from "../GameFooter";
import GameInfo from "../GameInfo";
import TimerDisplay from "../TimerDisplay";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getRoundInfo, getPlayers, getTiles, getMessages, getHint, getRoundPhase, getTurnStatus, getTimerTime, getTimerID, registerListener } from "../../api";

// TODO: make enums in constants file
const PlayerStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  CODEMASTER: "codemaster",
};

const RoundPhase = {
  HINT: "hint",
  GUESS: "guess",
};

const TurnStatus = {
  STARTED: "started",
  PAUSED: "paused",
  ENDED: "ended",
};

function GameScreen(props) {
  const roomCode = props.roomCode;
  const setGameState = props.setGameState;
  const history = useHistory();

  const [roundInfo, setRoundInfo] = useState([0, 0, 0, 0])
  const [players, setPlayers] = useState([]);
  const [tiles, setTiles] = useState([]);
  const [messages, setMessages] = useState(["", ""]);
  const [hint, setHint] = useState("");
  const [roundPhase, setRoundPhase] = useState();
  const [turnStatus, setTurnStatus] = useState();
  const [timerTime, setTimerTime] = useState(null);
  const [timerID, setTimerID] = useState(null);

  const playerID = sessionStorage.getItem("playerID");
  const player = players.find((player) => player.id === playerID);
  // TODO: should not be passing 3 separate booleans for 1 player status
  const isCodemaster = player && player.status === PlayerStatus.CODEMASTER;
  const isInactive = player && player.status === PlayerStatus.INACTIVE;
  const [headerMessage, footerMessage] = messages;
  const isTurnEnded = turnStatus === TurnStatus.ENDED;
  const shouldShowMessage = (message) => {
    if (turnStatus === TurnStatus.ENDED) {
      return timerTime === null && !!message;
    }

    if (roundPhase === RoundPhase.HINT) {
      if (turnStatus === TurnStatus.STARTED) {
        return !hint && !!message;
      }
    }

    return !!message;

    // if (roundPhase === RoundPhase.HINT) {
    //   if (turnStatus === TurnStatus.STARTED) {
    //     return !hint && !!message;
    //   } else if (turnStatus === TurnStatus.ENDED) {
    //     return timerTime === null && !!message;
    //   }
    // } else {
    //   return timerTime === null && !!message;
    // }
    // return !!message;
  };

  useEffect(() => {
    getRoundInfo(setRoundInfo);
    getPlayers(setPlayers);
    getTiles(setTiles);
    getMessages(setMessages);
    getHint(setHint);
    getRoundPhase(setRoundPhase);
    getTurnStatus(setTurnStatus);
    getTimerTime(setTimerTime);
    getTimerID(setTimerID);

    registerListener("roundInfoChange", () => getRoundInfo(setRoundInfo));
    registerListener("playerChange", () => getPlayers(setPlayers));
    registerListener("tileChange", () => getTiles(setTiles));
    registerListener("messagesChange", () => getMessages(setMessages));
    registerListener("hintChange", () => getHint(setHint));
    registerListener("roundPhaseChange", () => getRoundPhase(setRoundPhase));
    registerListener("turnStatusChange", () => getTurnStatus(setTurnStatus));
    registerListener("timerTimeChange", () => getTimerTime(setTimerTime));
    registerListener("timerIDChange", () => getTimerID(setTimerID));
  }, [roomCode, history]);

  return (
    <Container className="screen">
      <GameInfo roomCode={roomCode} roundInfo={roundInfo} />
      <PlayerRoster players={players} />
      {timerTime !== null && <TimerDisplay time={timerTime} isTurnEnded={isTurnEnded} />}
      {shouldShowMessage(headerMessage) && <Announcer message={headerMessage} />}
      {hint && <Announcer message={hint} />}
      <GameBoard tiles={tiles} />
      {shouldShowMessage(footerMessage) && <Announcer message={footerMessage} />}
      <GameFooter roomCode={roomCode} isCodemaster={isCodemaster} isInactive={isInactive} isTurnEnded={isTurnEnded} hint={hint} setTiles={setTiles} roundPhase={roundPhase} timerTime={timerTime} timerID={timerID} roundInfo={roundInfo} setGameState={setGameState}/>
    </Container>
  );
}

export default GameScreen;
