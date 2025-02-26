"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Container from "react-bootstrap/esm/Container";
import DefinitionLeftPart from "./DefinitionLeftPart";
import DefinitionRightPart from "./DefinitionRightPart";
import DefinitionEndUI from "./DefinitionEndUI";
import DefinitionProgressBar from "./DefinitionProgressBar";
import useDefinition from "./useDefinition";

export default function DefinitionApp({
   qnNumArray,
   email,
   title,
}: {
   qnNumArray: number[],
   email: string,
   title: string,
}) {

   const props = useDefinition({ qnNumArray, email });

   return <Container>
      <Row className="my-3">
         <Col>
            <h5 className="text-center m-0">{title}</h5>
         </Col>
      </Row>
      <Row>
         <DefinitionLeftPart props={props}/>
         <DefinitionRightPart props={props}/>
         <DefinitionEndUI props={props}/>
         <DefinitionProgressBar props={props}/>
      </Row>
   </Container>
}