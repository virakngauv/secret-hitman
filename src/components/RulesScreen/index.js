import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router";
import MenuHeader from "../MenuHeader";

import "./index.css"

function RulesScreen() {
  const history = useHistory();
  const navigateTo = (route) => {return () => history.push(route)};
  const goBack = () => history.goBack();

  const title = "Rules";
  const subtitle = "Learn how to play with the rules below!"

  return (
    <>
      <Container className="screen">
        <MenuHeader title={title} subtitle={subtitle} />
        <Row>
          <Col className="rules-text">
            <Tabs defaultActiveKey="general" id="rules-nav" className="mb-3">
              <Tab eventKey="general" title="General">
                Play this free-for-all variant of Codenames with friends or very friendly-looking strangers on the street. <br /><br />

                <b>Objective</b><br />
                Get the most points by generating the best hints and by deciphering hints the quickest!<br /><br />
              </Tab>
              <Tab eventKey="roles" title="Roles">
                <b>Roles</b><br />
                As the Codemaster, you want to direct the hitmen to the Targets (green) while avoiding Civilians (gray) and the Assassin (black). 
                You are allowed 1 hint for your turn consisting of a word and a number (e.g. "HOT 2"). You get 1 point for each correct target chosen
                while you are codemaster (but you also lose 1 point for each person that picks the assassin).  <br /><br />

                As a Hitman, you want to beat your fellow hitmen to the targets. Tap on a word to claim it. You and the Codemaster get 1 point 
                each for a correct word. Once everyone has ended their turn, the next Codemaster is chosen. Note: Your turn ends automatically 
                if you select a civilian (no point penalty) or the assassin (1 point penalty). <br /><br />
              </Tab>
              <Tab eventKey="game-flow" title="Game Flow">
                Each game has 3 rounds. Every player gets 1 turn per round. <br /><br />

                <b>Turn flow</b><br />
                At the start of a turn, the codemaster is shown which words are targets, civilians, and the assassin. <br /><br />

                Once they submit the hint, the hitmen race to guess the corresponding words. Targets and civilians can only be claimed once. 
                However assassins may be claimed by multiple hitmen causing the codemaster to get multiple point penalties! <br /><br />

                The turn ends when all the hitmen have ended their turn, either manually by clicking "End Turn" or by accidentally 
                selecting a civilian or assassin. <br /><br />

                When the last turn of the last round is complete, the final scores are posted.<br /><br />
              </Tab>
              <Tab eventKey="hint-rules" title="Hint Rules">
                <b>General Rules</b><br />
                Your hint must be about the meaning of the words, not the words themselves (e.g. their spelling).  <br /><br />
                Don't use the translation of the word as the hint itself (e.g. Using 'GATO' as a hint for 'CAT').  <br /><br />
                Different forms of words or parts of compound words that are on the board, are off-limts.  <br /><br />
                The spirit of the game is to come up with clever connections between words. If someone is constantly 
                being difficult, don't invite them to any more parties.<br /><br />

                <b>Invalid Hint</b><br />
                If the codemaster submits an invalid hint, as a hitman, you can challenge the validity of the hint with the 
                "Invalid Hint" button. If the codemaster concedes, scores roll back to what they were at the end of the last 
                turn and the codemaster gets a new set of words to try again.
              </Tab>
            </Tabs>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex mt-4">
            <Button onClick={goBack} variant="outline-secondary" size="sm" className="ms-auto me-auto">
              Back
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}
  
export default RulesScreen;
