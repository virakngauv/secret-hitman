import FooterClue from "../FooterClue";
import FooterGuesser from "../FooterGuesser";
import "./index.css";

function Footer(props) {
  const isCodemaster = props.isCodemaster;

  return (
    isCodemaster ? <FooterClue /> : <FooterGuesser />
  );
}

export default Footer;
