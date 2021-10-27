import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import GameFooter from "../GameFooter";
import GameInfo from "../GameInfo";
import TimerDisplay from "../TimerDisplay";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Button, Modal } from "react-bootstrap";
import { getRoundInfo, getPlayers, getTiles, getMessages, getHint, getRoundPhase, getTurnStatus, getPlayerCanSeeBoard, getTimerID, discardHint, keepHint, leaveRoom, registerListener } from "../../api";

const PlayerStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  CODEMASTER: "codemaster",
};

const TurnStatus = {
  STARTED: "started",
  PAUSED: "paused",
  ENDED: "ended",
};

function GameScreen(props) {
  // const { roomCode } = useParams();
  const roomCode = props.roomCode;
  const history = useHistory();

  // TODO: get value from server
  const [roundInfo, setRoundInfo] = useState([0, 0])
  const [players, setPlayers] = useState([]);
  // const [isCodemaster, setIsCodemaster] = useState(false);
  const playerID = sessionStorage.getItem("playerID");
  const player = players.find((player) => player.id === playerID);
  // TODO: should not be passing 3 separate booleans for 1 player status
  const isCodemaster = player && player.status === PlayerStatus.CODEMASTER;
  const isInactive = player && player.status === PlayerStatus.INACTIVE;
  const isActive = player && player.status === PlayerStatus.ACTIVE;
  // const [isForceDisabled, setIsForceDisabled] = useState(false);
  // setIsForceDisabled(isCodemaster);

  // console.log(`isForceDisabled is ${isForceDisabled}`);

  const [tiles, setTiles] = useState([]);
  const [messages, setMessages] = useState(["", ""]);
  const [hint, setHint] = useState("");
  const [roundPhase, setRoundPhase] = useState();
  const [turnStatus, setTurnStatus] = useState();
  // TODO: maybe move playerCanSeeBoard and associated API calls to a lower component if nothing else needs it
  const [playerCanSeeBoard, setPlayerCanSeeBoard] = useState(false);
  const [timerTime, setTimerTime] = useState(null);
  const [timerID, setTimerID] = useState(null);

  const [headerMessage, footerMessage] = messages;

  console.log(`messages is ${messages}, hint is ${hint}`);

  // console.log(`tiles.areRevealed is ${tiles.areRevealed}`);

  // // TODO: format this on the server side like the game tiles
  // const initialMessage = isCodemaster ? "type your hint below" : "hint pending..";
  // const message = hint === "" ? initialMessage : hint;

  const isTurnEnded = turnStatus === TurnStatus.ENDED;

  useEffect(() => {
    getRoundInfo(setRoundInfo);
    getPlayers(setPlayers);
    getTiles(setTiles);
    getMessages(setMessages);
    getHint(setHint);
    getRoundPhase(setRoundPhase);
    getTurnStatus(setTurnStatus);
    getPlayerCanSeeBoard(setPlayerCanSeeBoard);
    getTimerID(setTimerID);

    registerListener("roundInfoChange", () => getRoundInfo(setRoundInfo));
    registerListener("playerChange", () => getPlayers(setPlayers));
    registerListener("tileChange", () => getTiles(setTiles));
    registerListener("messagesChange", () => getMessages(setMessages));
    registerListener("hintChange", () => getHint(setHint));
    registerListener("roundPhaseChange", () => getRoundPhase(setRoundPhase));
    registerListener("turnStatusChange", () => getTurnStatus(setTurnStatus));
    registerListener("canSeeBoardChange", () => getPlayerCanSeeBoard(setPlayerCanSeeBoard));
    registerListener("timerTimeChange", (time) => setTimerTime(time));
    registerListener("timerIDChange", () => getTimerID(setTimerID));

    registerListener("playerKicked", (kickedPlayerID) => {
      const playerID = sessionStorage.getItem("playerID");
      if (playerID === kickedPlayerID) {
        history.push("/");
        leaveRoom(roomCode);
      } else {
        console.log("getPlayers cause you weren't kicked but someone else was..")
        getPlayers(setPlayers);
      }
    });
  }, [roomCode, history]);

  // TODO: Move Modal code to Codemaster Footer
  const isPaused = turnStatus === TurnStatus.PAUSED;
  // const [show, setShow] = useState(isPaused);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  // console.log(`turnStatus is ${turnStatus}`);
  // console.log(`isPaused is ${isPaused}`);

  function handleDiscardHint() {
    console.log(`handleDiscardHint has triggered`);

    discardHint();
    /*
    unpause
    respondToHintInvalidation
    */

  }

  function handleKeepHint() {
    console.log(`handleKeepHint has triggered`);
    keepHint();
  }

  return (
    <Container className="screen">
      <GameInfo roomCode={roomCode} roundInfo={roundInfo} />
      <PlayerRoster players={players} />
      {timerTime !== null && <TimerDisplay time={timerTime} isTurnEnded={isTurnEnded} />}
      {headerMessage && <Announcer message={headerMessage} />}
      {hint && <Announcer message={hint} />}
      <GameBoard tiles={tiles} />
      {footerMessage && <Announcer message={footerMessage} />}
      <GameFooter roomCode={roomCode} isCodemaster={isCodemaster} isInactive={isInactive} isTurnEnded={isTurnEnded} hint={hint} setTiles={setTiles} roundPhase={roundPhase} timerTime={timerTime} timerID={timerID} />
      {/* <GameFooter roomCode={roomCode} isCodemaster={isCodemaster} isInactive={isInactive} isActive={isActive} isTurnEnded={isTurnEnded} hint={hint} setTiles={setTiles} playerCanSeeBoard={playerCanSeeBoard} setPlayerCanSeeBoard={setPlayerCanSeeBoard} players={players} setMessages={setMessages} roundPhase={roundPhase} /> */}

      <Modal show={isPaused && isCodemaster} centered>
        <Modal.Header>
          <Modal.Title>Your hint was marked as invalid!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{`Do you agree that your hint "${hint}" is invalid? If you do, your hint will be discarded and you will get a new board.`}</Modal.Body>
        <Modal.Footer>
          <Button className="btn-menu ms-auto" size="sm" variant="outline-secondary" id="discard-hint-button" onClick={handleDiscardHint}>Discard the Hint</Button>
          <Button className="btn-menu me-auto" size="sm" variant="outline-secondary" id="keep-hint-button" onClick={handleKeepHint}>Keep the Hint</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GameScreen;
