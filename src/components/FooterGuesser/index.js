import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function FooterGuesser() {
    return (
      <ButtonGroup className="footer ms-auto me-auto" size="sm">
        <Button size="sm" variant="outline-secondary" id="report-invalid-hint-button">Invalid Hint</Button>
        <Button size="sm" variant="outline-secondary" id="end-turn-button">End Turn</Button>
      </ButtonGroup>
    );
  }
  
  export default FooterGuesser;
  