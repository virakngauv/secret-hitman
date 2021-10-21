import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import GameFooter from "../GameFooter"
import { useEffect, useState } from "react";
import Type from "../../constants/type.js";
import Status from "../../constants/status.js";
import State from "../../constants/state.js";
import { useHistory, useParams } from "react-router";
import { Button, ButtonGroup, Col, Modal, Row } from "react-bootstrap";
import { getPlayers, getTiles, getHint, getTurnStatus, getPlayerCanSeeBoard, discardHint, keepHint, leaveRoom, registerListener } from "../../api";

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

function GameScreen() {
//   const players = [
//     {
//       name: "Alfred", 
//       score: 9, 
//       status: Status.ACTIVE
//     },
//     {
//       name: "Beth", 
//       score: 13, 
//       status: Status.CODEMASTER
//     },
//     {
//       name: "Crim", 
//       score: 10, 
//       status: Status.ACTIVE
//     },
//     {
//       name: "Dion", 
//       score: -2, 
//       status: Status.INACTIVE
//     },
//     {
//       name: "Calphanlopos", 
//       score: 4, 
//       status: Status.INACTIVE
//     },
//     {
//       name: "Tundra", 
//       score: 12, 
//       status: Status.ACTIVE
//     },
//   ];

//   const codemasterMessages = [
//     "Type your hint below",
//   ];
//   const guesserMessages = [
//     "Calphanlopos is thinking..",
//     "Ready up!",
//     "Machine 5",
//   ];
//   const temporaryMessages = [
//     "Dion hit the assassin!",
//     "Crim also hit the assassin!",
//     "Beth hit a target!",
//     "Alfred hit a civilian!",
//   ];

//   const initTiles = [
//     {word: "bermuda", state: State.ENABLED}, 
//     {word: "casino", type: Type.TARGET, claimer: "Tundra", state: State.DISABLED_TRANSPARENT}, 
//     {word: "unicorn", type: Type.TARGET, claimer: "Calphanlopos", state: State.DISABLED_TRANSPARENT}, 
//     {word: "figure", type: Type.TARGET, claimer: "Beth", state: State.DISABLED_TRANSPARENT}, 
//     {word: "mail", state: State.ENABLED}, 
//     {word: "drop", state: State.ENABLED}, 
//     {word: "microscope", state: State.ENABLED}, 
//     {word: "watch", type: Type.TARGET, claimer: "Alfred", state: State.DISABLED_OPAQUE}, 
//     {word: "atlantis", state: State.ENABLED}, 
//     {word: "chair", type: Type.CIVILIAN, claimer: "Tundra", state: State.DISABLED_TRANSPARENT}, 
//     {word: "bell", state: State.ENABLED}, 
//     {word: "tick", state: State.ENABLED}, 
//   ];

//   const [tiles, setTiles] = useState(initTiles);

//   const codemasterTiles = [
//     {word: "bermuda", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "casino", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "unicorn", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "figure", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "mail", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "drop", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "microscope", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "watch", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
//     {word: "atlantis", type: Type.ASSASSIN, state: State.DISABLED_OPAQUE}, 
//     {word: "chair", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "bell", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//     {word: "tick", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
//   ];

  const { roomCode } = useParams();
  const history = useHistory();

  // TODO: get value from server
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
  const [hint, setHint] = useState("");
  const [turnStatus, setTurnStatus] = useState();
  // TODO: maybe move playerCanSeeBoard and associated API calls to a lower component if nothing else needs it
  const [playerCanSeeBoard, setPlayerCanSeeBoard] = useState(false);

  console.log(`tiles.areRevealed is ${tiles.areRevealed}`);

  // TODO: format this on the server side like the game tiles
  const initialMessage = isCodemaster ? "type your hint below" : "hint pending..";
  const message = hint === "" ? initialMessage : hint;

  const isTurnEnded = turnStatus === TurnStatus.ENDED;

  useEffect(() => {
    getPlayers(setPlayers);
    getTiles(setTiles);
    getHint(setHint);
    getTurnStatus(setTurnStatus);
    getPlayerCanSeeBoard(setPlayerCanSeeBoard);

    registerListener("playerChange", () => getPlayers(setPlayers));
    registerListener("tileChange", () => getTiles(setTiles));
    registerListener("hintChange", () => getHint(setHint));
    registerListener("turnStatusChange", () => getTurnStatus(setTurnStatus));
    registerListener("canSeeBoardChange", () => getPlayerCanSeeBoard(setPlayerCanSeeBoard));

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
  }, [roomCode]);

  // TODO: Move Modal code to Codemaster Footer
  const isPaused = turnStatus === TurnStatus.PAUSED;
  const [show, setShow] = useState(isPaused);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  console.log(`turnStatus is ${turnStatus}`);
  console.log(`isPaused is ${isPaused}`);

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
      <PlayerRoster players={players} />
      <Announcer message={message} />
      <GameBoard tiles={tiles} />
      <GameFooter roomCode={roomCode} isCodemaster={isCodemaster} isInactive={isInactive} isActive={isActive} isTurnEnded={isTurnEnded} hint={hint} setTiles={setTiles} playerCanSeeBoard={playerCanSeeBoard} setPlayerCanSeeBoard={setPlayerCanSeeBoard} players={players} />

      <Modal show={isPaused && isCodemaster} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your hint was marked as invalid!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Do you agree that your hint is invalid? (Discuss with the group first)</Modal.Body>
        <Modal.Footer>
          <Button className="btn-menu ms-auto" size="sm" variant="outline-secondary" id="discard-hint-button" onClick={handleDiscardHint}>Discard the Hint</Button>
          <Button className="btn-menu me-auto" size="sm" variant="outline-secondary" id="keep-hint-button" onClick={handleKeepHint}>Keep the Hint</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default GameScreen;
