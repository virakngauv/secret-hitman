import { Col, Row } from "react-bootstrap";
import "./index.css"

function MenuHeader(props) {
  const title = props.title;
  const subtitle = props.subtitle;

  return (
    <>
      <Row>
        <Col className="d-flex">
          <h1 className="menu-header-title ms-auto me-auto">
            {title}
          </h1>
        </Col>
      </Row>
      <Row>
        <Col className="d-flex">
          <div className="menu-header-subtitle ms-auto me-auto">
          {subtitle}
          </div>
        </Col>
      </Row>
      <hr className="app-hr" />
    </>
  );
}
  
export default MenuHeader;
