'use client';

import React from 'react';
import { Col } from "react-bootstrap";

export default function GenericAnsIndicator({ QnContextToUse }: any) {
  const { isCorrect } = QnContextToUse();

  switch (isCorrect) {
    case true:
      return <RightAnsIndicator />;
    case false:
      return <WrongAnsIndicator />;
    case null:
      return null;
  }
};

function RightAnsIndicator() {
   return (
      <Col className="text-center">
         <div
            className="px-3 py-1 rounded-5 border-bottom border-2 d-inline-block"
            style={{
               backgroundColor: "rgb(220, 255, 220)",
               fontSize: "18px",
            }}
         >
            <div className="d-flex align-items-center">
               <i
                  className="bi bi-check2"
                  style={{
                     color: "green",
                     fontSize: "20px",
                  }}
               ></i>
               &nbsp;
               <span style={{ color: "green" }}>Correct</span>
            </div>
         </div>
      </Col>
   );
};

function WrongAnsIndicator() {
   return (
      <Col className="text-center">
         <div
            className="px-3 py-1 rounded-5 border-bottom border-2 d-inline-block"
            style={{
               backgroundColor: "rgb(255, 220, 220)",
               fontSize: "18px",
            }}
         >
            <div className="d-flex align-items-center">
               <i
                  className="bi bi-x-lg"
                  style={{
                     color: "rgb(190, 44, 44)",
                     fontSize: "18px",
                  }}
               ></i>
               &nbsp;
               <span style={{ color: "rgb(190, 44, 44)" }}>Incorrect</span>
            </div>
         </div>
      </Col>
   );
};