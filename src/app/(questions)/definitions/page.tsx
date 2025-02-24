import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import Link from "next/link";
import React from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";

export default async function SpellingHomePage() {
   await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Definitions</h5>
            </Col>
         </Row>

         <Row>
            <Col>                  
               <div className="card h-100 bg-light border-0 shadow">
                  <div className="card-body">
                     <Link href="/definitions/1">Click here</Link>
                  </div>
               </div>
            </Col>
         </Row>
      </Container>
   )
}
