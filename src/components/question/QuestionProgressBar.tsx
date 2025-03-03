"use client";

import ProgressBar from "react-bootstrap/ProgressBar";
import Col from "react-bootstrap/Col";
import { useQuestionContext } from './QuestionProvider';

export default function QuestionProgressBar() {

   const {
      setInfo: { hasReachedEnd, numQnsInSet },
      userInfo: { numAttempted, numCorrect },
   } = useQuestionContext();

   if (hasReachedEnd) return null;

   const numWrong = numAttempted - numCorrect;
   const percentCorrect = Math.round(100*numCorrect/numQnsInSet) || 0;
   const percentWrong = Math.round(100*numWrong/numQnsInSet) || 0;

   return (
      <Col className="mt-4" style={{height: "50px"}}>
         <ProgressBar className="w-75 mx-auto">
            <ProgressBar variant="success" now={percentCorrect} key={1} label={numCorrect}/>
            <ProgressBar variant="danger" now={percentWrong} key={2} label={numWrong}/>
         </ProgressBar>
      </Col>
   )
}