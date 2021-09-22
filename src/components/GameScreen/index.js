import Container from "react-bootstrap/Container";
import Announcer from "../Announcer";
import PlayerRoster from "../PlayerRoster";
import GameBoard from "../GameBoard";
import GameFooter from "../GameFooter"
import { useState } from "react";
import Type from "../../constants/type.js";
import Status from "../../constants/status.js";
import State from "../../constants/state.js";
import { useHistory, useParams } from "react-router";
import { Button, Col, Row } from "react-bootstrap";

function GameScreen() {
  const players = [
    {
      name: "Alfred", 
      score: 9, 
      status: Status.ACTIVE
    },
    {
      name: "Beth", 
      score: 13, 
      status: Status.CODEMASTER
    },
    {
      name: "Crim", 
      score: 10, 
      status: Status.ACTIVE
    },
    {
      name: "Dion", 
      score: -2, 
      status: Status.INACTIVE
    },
    {
      name: "Calphanlopos", 
      score: 4, 
      status: Status.INACTIVE
    },
    {
      name: "Tundra", 
      score: 12, 
      status: Status.ACTIVE
    },
  ];

  const codemasterMessages = [
    "Type your hint below",
  ];
  const guesserMessages = [
    "Calphanlopos is thinking..",
    "Ready up!",
    "Machine 5",
  ];
  const temporaryMessages = [
    "Dion hit the assassin!",
    "Crim also hit the assassin!",
    "Beth hit a target!",
    "Alfred hit a civilian!",
  ];

  const initTiles = [
    {word: "bermuda", state: State.ENABLED}, 
    {word: "casino", type: Type.TARGET, claimer: "Tundra", state: State.DISABLED_TRANSPARENT}, 
    {word: "unicorn", type: Type.TARGET, claimer: "Calphanlopos", state: State.DISABLED_TRANSPARENT}, 
    {word: "figure", type: Type.TARGET, claimer: "Beth", state: State.DISABLED_TRANSPARENT}, 
    {word: "mail", state: State.ENABLED}, 
    {word: "drop", state: State.ENABLED}, 
    {word: "microscope", state: State.ENABLED}, 
    {word: "watch", type: Type.TARGET, claimer: "Alfred", state: State.DISABLED_OPAQUE}, 
    {word: "atlantis", state: State.ENABLED}, 
    {word: "chair", type: Type.CIVILIAN, claimer: "Tundra", state: State.DISABLED_TRANSPARENT}, 
    {word: "bell", state: State.ENABLED}, 
    {word: "tick", state: State.ENABLED}, 
  ];

  const [tiles, setTiles] = useState(initTiles);

  const codemasterTiles = [
    {word: "bermuda", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "casino", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "unicorn", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "figure", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "mail", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "drop", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "microscope", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "watch", type: Type.TARGET, state: State.DISABLED_OPAQUE}, 
    {word: "atlantis", type: Type.ASSASSIN, state: State.DISABLED_OPAQUE}, 
    {word: "chair", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "bell", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
    {word: "tick", type: Type.CIVILIAN, state: State.DISABLED_OPAQUE}, 
  ];

  // TODO: get value from server
  const [isCodemaster, setIsCodemaster] = useState(false);

  const [isForceDisabled, setIsForceDisabled] = useState(isCodemaster);

  const { roomCode } = useParams();
  console.log(roomCode);

  const history = useHistory();

  return (
    <Container className="screen">
      <PlayerRoster players={players} />
      <Announcer message={isCodemaster ? codemasterMessages : guesserMessages[2]} />
      <GameBoard tiles={isCodemaster ? codemasterTiles : tiles} setTiles={setTiles} isForceDisabled={isForceDisabled} setIsForceDisabled={setIsForceDisabled} />
      <GameFooter isCodemaster={isCodemaster} />
      {/* temp code below */}
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={() => setIsCodemaster(!isCodemaster)} variant="outline-secondary" size="sm" className="ms-auto me-auto">
            (temp) toggle codemaster
          </Button>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex mt-4">
          <Button onClick={history.goBack} variant="outline-secondary" size="sm" className="ms-auto me-1">
            (temp) back
          </Button>
          <Button onClick={() => history.push("/temp-end-game")} variant="outline-secondary" size="sm" className="ms-1 me-auto">
            (temp) end screen
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default GameScreen;
