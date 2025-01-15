"use client";

import { MCQContextValue } from "@/types";
import ProgressBar from "react-bootstrap/ProgressBar";
import Col from "react-bootstrap/Col";

export default function GenericProgressBar({
   QnContextToUse
}: {
   QnContextToUse: () => MCQContextValue
}) {

   const { thisSessionScore: [ numQnsCorrect, numQnsDone ], numQnsInSet, hasReachedEnd } = QnContextToUse();

   if (hasReachedEnd) return null;

   const numQnsWrong = numQnsDone - numQnsCorrect
   const percentCorrect = Math.round(100*numQnsCorrect/numQnsInSet) || 0;
   const percentWrong = Math.round(100*numQnsWrong/numQnsInSet) || 0;

   return (
      <Col className="mt-4">
         <ProgressBar className="w-75 mx-auto">
            <ProgressBar animated variant="success" now={percentCorrect} key={1}/>
            <ProgressBar animated variant="danger" now={percentWrong} key={2}/>
         </ProgressBar>
      </Col>
   )

}