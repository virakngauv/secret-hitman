import "./index.css";
import { Row, Col, Container, OverlayTrigger, Popover } from "react-bootstrap";

const gratitudePopover = (
  <Popover id="gratitude-popover">
    <Popover.Body className="gratitude-popover-text">
      {`Kim, Michelle, and Pearline for UX/UI feedback. Jenny, Cynthia, and Sovathya for early design questioning. Eilene for playing with friends. Truc for encouragement. Theo for poking around. And all my playtesters! (I think that includes you?)`}
    </Popover.Body>
  </Popover>
);

const GratitudeLink = ({children}) => (
  <OverlayTrigger trigger="click" placement="top" overlay={gratitudePopover} rootClose>
    <button
      type="button"
      className="link-button"
    >
      {children}
    </button>
  </OverlayTrigger>
);

function AppFooter() {
  return (
    <Container className="app-footer">
      <hr className="app-hr" />
      <Row>
        <Col className="d-flex">
          <div className="app-footer-text ms-auto me-auto text-center">
            Inspired by <a href="https://spyfall.tannerkrewson.com/">Spyfall</a>🕵️<br />
            with help from these fine <GratitudeLink>folks</GratitudeLink>❤️<br />
            and managed on <a href="https://github.com/virakngauv/secret-hitman/">GitHub</a>💾.
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AppFooter;
