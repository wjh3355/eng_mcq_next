import Notice from "./Notice";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Link from "next/link";

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

         <Row>
            <Col className="d-flex justify-content-center">
               <Link href="/demo" className="btn btn-lg btn-primary">
                  Demo Questions
               </Link>
            </Col>
         </Row>
      </Container>
   );
};