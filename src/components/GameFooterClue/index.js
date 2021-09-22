import { DropdownButton, FormControl, Button, Dropdown, Form } from "react-bootstrap";
import { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";

function GameFooterClue(props) {
  const [hint, setHint] = useState("");
  const [hintNumber, setHintNumber] = useState("#");

  const handleHintChange = (e) => {setHint(e.target.value);}
  const handleHintNumberChange = (hintNumber) => {setHintNumber(hintNumber);  }

  // This will eventually come from parent props
  const submitClue = () => console.log(hint, hintNumber);

  function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    submitClue();
  }

  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup size="sm" className="game-footer ms-auto me-auto">
        <FormControl
          name="hint"
          placeholder="Type your hint.."
          onChange={handleHintChange}
        />
        <DropdownButton
          name="hintNumber"
          variant="outline-secondary"
          title={hintNumber}
          id="hint-number-dropdown"
          onSelect={(eventKey) => {
            handleHintNumberChange(eventKey);
          }}
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
        <Button variant="outline-secondary" id="submit-clue-button" className="btn-menu">Submit</Button>
      </InputGroup>
    </Form>
  );
}

export default GameFooterClue;
