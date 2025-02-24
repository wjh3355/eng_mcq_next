"use client";

import ProgressBar from "react-bootstrap/ProgressBar";
import Col from "react-bootstrap/Col";
import { useDefinitionContext } from './DefinitionContext';

export default function DefinitionProgressBar() {

   const { 
      setInfo: { hasReachedEnd, numQnsInSet },
      userInfo: { numAttempted, numCorrect }
   } = useDefinitionContext();

   if (hasReachedEnd) return null;

   const numQnsWrong = numAttempted - numCorrect
   const percentCorrect = Math.round(100*numCorrect/numQnsInSet) || 0;
   const percentWrong = Math.round(100*numQnsWrong/numQnsInSet) || 0;

   return (
      <Col className="mt-4" style={{height: "50px"}}>
         <ProgressBar className="w-75 mx-auto">
            <ProgressBar variant="success" now={percentCorrect} key={1} label={numCorrect}/>
            <ProgressBar variant="danger" now={percentWrong} key={2} label={numQnsWrong}/>
         </ProgressBar>
      </Col>
   )

}