"use client";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import Container from "react-bootstrap/esm/Container";
import { TriangleAlert } from "lucide-react";
import useGenericSpellingProvider from "./GenericSpellingProvider";
import GenericSpelling from "./GenericSpelling";
import ProgressBar from "react-bootstrap/esm/ProgressBar";
import { range, shuffle } from "lodash";
import GenericSpellingEnd from "./GenericSpellingEnd";

export default function SpellingApp() {

   // initialize the SpellingProvider with the appropriate context
   const { SpellingProvider, useSpellingContext } = useGenericSpellingProvider({
      qnNumArray: shuffle(range(1, 101))
   });

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

   // Component to display progress bar
   function PBar() {
      const { 
         thisSessionScore: [ numQnsCorrect, numQnsDone ], 
         numQnsInSet, 
         hasReachedEnd 
      } = useSpellingContext();
   
      if (hasReachedEnd) return null;
   
      const numQnsWrong = numQnsDone - numQnsCorrect
      const percentCorrect = Math.round(100*numQnsCorrect/numQnsInSet) || 0;
      const percentWrong = Math.round(100*numQnsWrong/numQnsInSet) || 0;
   
      return (
         <Col className="mt-4" style={{height: "50px"}}>
            <ProgressBar className="w-75 mx-auto">
               <ProgressBar variant="success" now={percentCorrect} key={1} label={numQnsCorrect}/>
               <ProgressBar variant="danger" now={percentWrong} key={2} label={numQnsWrong}/>
            </ProgressBar>
         </Col>
      )
   
   }

   return <Container>
      <SpellingProvider>
         <Row className="my-3">
            <Col>
               <ErrorContainer/>
               <h5 className="text-center m-0">PSLE Spelling</h5>
            </Col>
         </Row>
         <Row>
            <GenericSpelling QnContextToUse={useSpellingContext}/>
            <GenericSpellingEnd QnContextToUse={useSpellingContext}/>
            <PBar/>
         </Row>
      </SpellingProvider>
   </Container>
}