import { Col, Container, Row } from "react-bootstrap";

export default function Page() {

   return(
      <Container className="my-3">
         <Row>
            <Col className="text-center">
               <h4>About this Website</h4>
            </Col>
         </Row>
         <Row>
            <Col className="text-center">
               <p>Will be added soon!</p>
            </Col>
         </Row>
      </Container>
   );
}