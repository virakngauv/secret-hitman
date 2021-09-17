import "./index.css";
import { Row, Col, Container } from "react-bootstrap";

function AppFooter() {
  return (
    <Container className="app-footer">
      <hr className="app-hr" />
      <Row>
        <Col className="d-flex">
          <div className="app-footer-text ms-auto me-auto">
            Inspired by: <a href="https://spyfall.tannerkrewson.com/">Spyfall</a> | With help from these fine <a href="/#">folks</a> | <a href="https://github.com/virakngauv/secret-hitman/"> Managed on GitHub</a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default AppFooter;
