'use client';

import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import Skeleton from "react-loading-skeleton";
import { BookText, CircleArrowRight } from "lucide-react";
import { useDefinitionContext } from "./DefinitionContext";
import styled, { keyframes } from "styled-components";

export default function DefinitionLeftPart() {

   const {
      callbacks: { handleNextQnBtnClick },
      userInfo: { userPoints, wrongAnsArr, isCorrect },
      setInfo: { hasReachedEnd, currQnNum },
      qnObj: { definitionToTest },
      isLoading,
   } = useDefinitionContext();

   const [isReviewShown, setIsReviewShown] = useState(false);

   if (hasReachedEnd) return null;

   function ScoreComponent() {
      return (
         <div className="border border-2 border-warning rounded-2 px-2 py-1 fw-bold">
            {Number.isNaN(userPoints)
               ?  <Spinner animation="border" size="sm" className="mx-4" variant="secondary"/> 
               :  <span>Points: {userPoints}</span>
            }
         </div>
      );
   }

   return (
      <Col lg={8} md={7}>
         <Card body className="mb-3 shadow border-0">
            {isLoading 
               ?  <Skeleton height="24px" />
               :  <TypingAnim num={currQnNum} sentence={definitionToTest} />
            }
         </Card>

         <section className="hstack gap-3 mb-3">

            <ScoreComponent/>

            <button 
               className="border-0 bg-transparent p-0 ms-auto"
               disabled={wrongAnsArr.length === 0}
               onClick={() => setIsReviewShown(!isReviewShown)}
            >
               <BookText size={25} strokeWidth={2}/>
            </button>

            <Button 
               variant="primary" 
               className="d-flex align-items-center justify-content-center px-4"
               disabled={isCorrect === null}
               onClick={() => handleNextQnBtnClick()}
            >
               <strong>Next&nbsp;</strong><CircleArrowRight size={22} strokeWidth={2}/>
            </Button>

         </section>

         <Modal size="lg" centered show={isReviewShown} onHide={() => setIsReviewShown(!isReviewShown)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Review Incorrect Questions</Modal.Title></Modal.Header>
            <Modal.Body>
               {wrongAnsArr.map(({ definitionToTest, correctAns, type }, idx) =>
                  <p key={idx}>
                     {`${correctAns} (${type}): ${definitionToTest}`}
                  </p>
               )}
            </Modal.Body>
         </Modal>

      </Col>
   );
};

function TypingAnim({ 
   sentence,
   num
}: { 
   sentence: string,
   num: number
}){

   return (
      <TypingAnimContainer>
         {`Q${num}. `}

         {sentence.split('').map((char, idx) => 
            <TypingAnimChar key={`before-${idx}`} $index={idx}>
               {char}
            </TypingAnimChar>
         )}

      </TypingAnimContainer>
   );
};

const TypingAnimContainer = styled.div`
   display: block;
   width: 100%;
   overflow: hidden;
   word-break: break-word;
   font-size: 18px
`;

const TypingAnimChar = styled.span<{
   $index: number;
}>`
   opacity: 0;
   animation: ${keyframes` from { opacity: 0 } to { opacity: 1 } `} 10ms linear forwards;
   animation-delay: ${({$index}) => $index * 12 }ms;
`;