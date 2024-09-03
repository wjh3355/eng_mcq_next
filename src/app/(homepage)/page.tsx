import Notice from "./Notice";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Page() {
   return (
      <Container>
         <Row className="my-3">
            <Col className="text-center">
               <h4>Welcome to Sunbird English</h4>
            </Col>
         </Row>

         <Row>
            <Col>
               <Notice/>
            </Col>
         </Row>

      </Container>
   );
};