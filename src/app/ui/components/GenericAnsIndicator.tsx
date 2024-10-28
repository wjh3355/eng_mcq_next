'use client';

import { MCQContextValue } from '@/types';
import React from 'react';
import Col from "react-bootstrap/Col";

export default function GenericAnsIndicator({ 
   QnContextToUse 
}: {
   QnContextToUse: () => MCQContextValue
}) {
   const { isCorrect } = QnContextToUse();

   switch (isCorrect) {
      case true:
         return <RightAnsIndicator />;
      case false:
         return <WrongAnsIndicator />;
      case null:
         return null;
   }
}

function RightAnsIndicator() {
   return (
      <Col className="text-center">
         <div
            className="px-3 py-1 rounded-5 border-bottom border-2 d-inline-block"
            style={{backgroundColor: "rgb(220, 255, 220)"}}
         >
            <div className="d-flex align-items-center" style={{color: "green"}}>
               ✔&nbsp;&nbsp;<strong>Correct</strong>
            </div>
         </div>
      </Col>
   );
}

function WrongAnsIndicator() {
   return (
      <Col className="text-center">
         <div
            className="px-3 py-1 rounded-5 border-bottom border-2 d-inline-block"
            style={{backgroundColor: "rgb(255, 220, 220)",}}
         >
            <div className="d-flex align-items-center" style={{ color: "rgb(190, 44, 44)" }}>
               ✖&nbsp;&nbsp;<strong>Incorrect</strong>
            </div>
         </div>
      </Col>
   );
}