import { DropdownButton, FormControl, Button, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import { submitHint } from "../../api";
import "./index.css";

function GameFooterClue(props) {
  const roomCode = props.roomCode;
  const initialHint = props.hint ?? "";
  const hasInitialHint = props.hint ? true : false;

  const [hint, setHint] = useState(initialHint);
  const [hintNumber, setHintNumber] = useState("#");

  const handleHintChange = (e) => {setHint(e.target.value);};
  const handleHintNumberChange = (hintNumber) => {setHintNumber(hintNumber);};

  // This will eventually come from parent props
  const submitClue = () => console.log(hint, hintNumber);

  console.log(`hasInitialHint is ${hasInitialHint}`);


  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    const fullHint = `${hint} ${hintNumber}`;
    console.log(`fullHint is ${fullHint}`);

    submitHint(roomCode, fullHint);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup size="sm" className="game-footer ms-auto me-auto">
        <FormControl
          name="hint"
          placeholder="Type your hint.."
          onChange={handleHintChange}
          readOnly={hasInitialHint}
          className={hasInitialHint && "hint-form-disabled"}
        />
        <DropdownButton
          name="hintNumber"
          variant="outline-secondary"
          title={hintNumber}
          id="hint-number-dropdown"
          className="btn-menu"
          onSelect={(eventKey) => {
            handleHintNumberChange(eventKey);
          }}
          disabled={hasInitialHint}
        >
          <Dropdown.Item eventKey="Infinity">Infinity</Dropdown.Item>
          <Dropdown.Item eventKey="Zero">Zero</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item eventKey="6">6</Dropdown.Item>
          <Dropdown.Item eventKey="5">5</Dropdown.Item>
          <Dropdown.Item eventKey="4">4</Dropdown.Item>
          <Dropdown.Item eventKey="3">3</Dropdown.Item>
          <Dropdown.Item eventKey="2">2</Dropdown.Item>
          <Dropdown.Item eventKey="1">1</Dropdown.Item>
        </DropdownButton>
        <Button type="submit" variant="outline-secondary" id="submit-clue-button" className="btn-menu" disabled={hasInitialHint}>Submit</Button>
      </InputGroup>
    </Form>
  );
}

export default GameFooterClue;
