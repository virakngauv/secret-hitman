import { DropdownButton, FormControl, Button, Dropdown } from "react-bootstrap";
import { useState } from "react";

function FooterClue() {
    const [hintNumber, setHintNumber] = useState("#");

    return (
        <>
            <FormControl placeholder="Type your hint.." />
            <DropdownButton
                variant="outline-secondary"
                title={hintNumber}
                id="hint-number-dropdown"
                onSelect={(eventKey) => {
                    setHintNumber(eventKey);
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
            <Button variant="outline-secondary" id="submit-clue-button">Submit</Button>
        </>
    );
  }
  
  export default FooterClue;
  