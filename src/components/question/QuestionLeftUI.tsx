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
import { getDemoQnCat } from "@/definitions";

function SentenceCard() {
   const {
      collection,
      isLoading,
      qnObj,
      setInfo: { currQnNum }
   } = useQuestionContext();

   if (isLoading) return (
      <Card className="mb-3 shadow border-0">
         <Card.Body>
            <Skeleton height="24px"/>
         </Card.Body>
      </Card>
   );

   if (collection === 'demo') {
      return (
         <Card className="mb-3 shadow border-0">
            <Card.Header>
               <small>From {getDemoQnCat(qnObj.qnNum)}</small>
            </Card.Header>
            <Card.Body>
               <QuestionSentenceDisp qnObj={qnObj} num={currQnNum}/>
            </Card.Body>
         </Card>
      );
   } else {
      return (
         <Card className="mb-3 shadow border-0">
            <Card.Body>
               <QuestionSentenceDisp qnObj={qnObj} num={currQnNum}/>
            </Card.Body>
         </Card>
      );
   }
}

function ScoreComponent() {

   const {
      collection,
      userInfo: { userPoints },
      setInfo: { isRedoWrongQns}
   } = useQuestionContext();

   if (collection === "demo" || isRedoWrongQns) return null;

   return (
      <div className="border border-2 border-warning rounded-2 px-2 py-1 fw-bold">
         {Number.isNaN(userPoints)
            ?  <Spinner animation="border" size="sm" className="mx-4" variant="secondary"/> 
            :  <span>Points: {userPoints}</span>
         }
      </div>
   );
}

export default function QuestionLeftUI() {

   const {
      collection,
      qnObj,
      setInfo: { hasReachedEnd },
      userInfo: { isCorrect, wronglyAnswered },
      callbacks: { handleNextQnBtnClick }
   } = useQuestionContext();

   const [isReviewShown, setIsReviewShown] = useState(false);
   const [isExplShown, setIsExplShown] = useState(false);
   const [isHelpShown, setIsHelpShown] = useState(false);

   if (hasReachedEnd) return null;

   return (
      <Col lg={8} md={7}>

         <SentenceCard/>

         <section className="hstack gap-3 mb-3">

            <ScoreComponent/>

            <div className="ms-auto"/>

            {
               collection === 'demo' && 
               <Button variant="link" className="p-0" onClick={() => setIsHelpShown(true)}>
                  Help
               </Button>
            }

            <button 
               className="border-0 bg-transparent p-0"
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

         <Modal size="lg" centered show={isHelpShown} onHide={() => setIsHelpShown(false)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Help</Modal.Title></Modal.Header>
            <Modal.Body style={{textAlign: "justify", lineHeight: "25px"}}>
               <p>You will be presented with a series of questions that test vocabulary, grammar or spelling.</p>
               <ul>
                  <li>If there is a <strong>bolded</strong> word or phrase in the sentence, choose the option closest in meaning to it.</li>
                  <li>If there is a <u>blank</u> in the sentence, choose the option that best fits the blank.</li>
                  <li>If there is a <strong>misspelled</strong> word in the sentence, input the correct word. This is case sensitive.</li>
               </ul>
               <p>
                  The <BadgeInfo size={21} strokeWidth={2}/> icon displays an explanation of the word/phrase tested in the question, while <BookText size={21} strokeWidth={2}/> keeps track of all the questions you answered wrongly. Clicking
                  <Button 
                     variant="primary"
                     size="sm"
                     className="d-inline mx-2"
                  >
                     Next&nbsp;<CircleArrowRight size={20} strokeWidth={2} className="my-auto"/>
                  </Button>
                  displays the next question (once you answered the current one).
               </p>
            </Modal.Body>
         </Modal>
      </Col>
   );
};