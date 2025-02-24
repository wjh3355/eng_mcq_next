"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Container from "react-bootstrap/esm/Container";
import DefinitionProvider from "./DefinitionContext";
import DefinitionLeftPart from "./DefinitionLeftPart";
import DefinitionRightPart from "./DefinitionRightPart";
import DefinitionEndUI from "./DefinitionEndUI";
import DefinitionProgressBar from "./DefinitionProgressBar";

export default function DefinitionApp({
   qnNumArray,
   email,
   title,
}: {
   qnNumArray: number[],
   email: string,
   title: string,
}) {

   return <Container>
      <Row className="my-3">
         <Col>
            <h5 className="text-center m-0">{title}</h5>
         </Col>
      </Row>
      <Row>
         <DefinitionProvider 
            qnNumArray={qnNumArray} 
            email={email}
         >
            <DefinitionLeftPart/>
            <DefinitionRightPart/>
            <DefinitionEndUI
               
            />
            <DefinitionProgressBar/>
         </DefinitionProvider>
      </Row>
   </Container>
}