import InputGroup from "react-bootstrap/InputGroup";
import FooterClue from "../FooterClue";
import FooterGuesser from "../FooterGuesser";
import "./index.css";

function Footer(props) {
  const isCodemaster = props.isCodemaster;

  return (
    <InputGroup size="sm" className="footer ms-auto me-auto">
      {isCodemaster ? <FooterClue /> : <FooterGuesser />}
    </InputGroup>
  );
}

export default Footer;
