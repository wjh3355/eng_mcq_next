'use client';

import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import Skeleton from "react-loading-skeleton";
import { BadgeInfo, BookText, CircleArrowRight } from "lucide-react";
import { useQuestionContext } from "./QuestionProvider";
import QuestionSentenceDisp from "./QuestionSentenceDisp";
import QuestionExplanation from "./QuestionExplanation";
import QuestionPaginatedExplanation from "./QuestionPaginatedExplanation";

export default function QuestionLeftUI() {

   const {
      collection,
      qnObj,
      isLoading,
      setInfo: { currQnNum, hasReachedEnd },
      userInfo: { userPoints, isCorrect, wronglyAnswered },
      callbacks: { handleNextQnBtnClick }
   } = useQuestionContext();

   const [isReviewShown, setIsReviewShown] = useState(false);
   const [isExplShown, setIsExplShown] = useState(false);

   if (hasReachedEnd) return null;

   function ScoreComponent() {
      if (collection === "demo") return null;

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
               :  <QuestionSentenceDisp qnObj={qnObj} num={currQnNum}/>
            }
         </Card>

         <section className="hstack gap-3 mb-3">

            <ScoreComponent/>

            <button 
               className="border-0 bg-transparent p-0 ms-auto"
               disabled={isCorrect === null}
               onClick={() => setIsExplShown(!isExplShown)}
            >
               <BadgeInfo size={25} strokeWidth={2}/>
            </button>

            <button 
               className="border-0 bg-transparent p-0"
               disabled={wronglyAnswered.length === 0}
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
            <Modal.Body><QuestionPaginatedExplanation qnObjArr={wronglyAnswered}/></Modal.Body>
         </Modal>

         <Modal size="lg" centered show={isExplShown} onHide={() => setIsExplShown(!isExplShown)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Explanation</Modal.Title></Modal.Header>
            <Modal.Body><QuestionExplanation qnObj={qnObj}/></Modal.Body>
         </Modal>
      </Col>
   );
};