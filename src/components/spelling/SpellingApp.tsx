"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import Container from "react-bootstrap/esm/Container";
import { TriangleAlert } from "lucide-react";
import useSpellingCtxProvider from "./useSpellingCtxProvider";
import GenericSpelling from "./GenericSpelling";
import GenericSpellingEnd from "./GenericSpellingEnd";
import GenericProgressBar from "../GenericProgressBar";

export default function SpellingApp({
   email,
   qnNumArray,
   title
}: {
   email: string,
   qnNumArray: number[]
   title: string
}) {

   // initialize the SpellingProvider with the appropriate context
   const { SpellingProvider, useSpellingContext } = useSpellingCtxProvider({ qnNumArray, email });

   // Component to display error message (might replace with toast later)
   function ErrorContainer() {
      const { error } = useSpellingContext();

      if (!error) return;

      return (
         <Alert variant="danger" dismissible className="d-flex align-items-center">
            <TriangleAlert />&nbsp;<strong>Error: {error}</strong>
         </Alert>
      );
   }

   return <Container>
      <SpellingProvider>
         <Row className="my-3">
            <Col>
               <ErrorContainer/>
               <h5 className="text-center m-0">{title}</h5>
            </Col>
         </Row>
         <Row>
            <GenericSpelling QnContextToUse={useSpellingContext}/>
            <GenericSpellingEnd QnContextToUse={useSpellingContext}/>
            <GenericProgressBar QnContextToUse={useSpellingContext}/>
         </Row>
      </SpellingProvider>
   </Container>
}