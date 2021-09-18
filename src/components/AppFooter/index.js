import "./index.css";
import { Row, Col, Container } from "react-bootstrap";

function AppFooter() {
  return (
    <Container className="app-footer">
      <hr className="app-hr" />
      <Row>
        <Col className="d-flex">
          <div className="app-footer-text ms-auto me-auto text-center">
            Inspired by <a href="https://spyfall.tannerkrewson.com/">Spyfall</a> <br />
            with help from these fine <a href="/#">folks</a><br />
            and managed on <a href="https://github.com/virakngauv/secret-hitman/">GitHub</a>.
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AppFooter;
