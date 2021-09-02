import { ButtonGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';

function FooterGuesser() {
    return (
      <ButtonGroup className="footer ms-auto me-auto d-flex" size="sm">
        <Button className="btn-footer" size="sm" variant="outline-secondary" id="report-invalid-hint-button">Invalid Hint</Button>
        <Button className="btn-footer" size="sm" variant="outline-secondary" id="end-turn-button">End Turn</Button>
      </ButtonGroup>
    );
  }
  
  export default FooterGuesser;
  