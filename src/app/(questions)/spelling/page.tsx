import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import Link from "next/link";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

export default async function SpellingHomePage() {
   await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Spelling Sets</h5>
            </Col>
         </Row>

         <Row>
            <Col>
               <Link href="/spelling/1">Click here</Link>
            </Col>
         </Row>
      </Container>
   )
}