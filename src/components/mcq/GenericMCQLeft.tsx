'use client';

import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import DictionaryEntry from "../dict/DictionaryEntry";
import MCQQnSentence from "./MCQQnSentence";
import PaginatedDictEntries from "../dict/PaginatedDictEntries";
import { MCQContextValue } from '@/definitions';

import Skeleton from "react-loading-skeleton";
import { BadgeInfo, BookText, CircleArrowRight } from "lucide-react";

export default function GenericMCQLeft({ QnContextToUse }: { QnContextToUse: () => MCQContextValue }) {

   const {
      handleNextQnBtnClick,
      userPoints,
      wrongAnsArr,
      qnObj,
      isLoading,
      isCorrect,
      hasReachedEnd,
      currNum
   } = QnContextToUse();

   const { sentence, wordToTest } = qnObj;

   const [isReviewShown, setIsReviewShown] = useState(false);
   const [isExplShown, setIsExplShown] = useState(false);

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
               :  <MCQQnSentence sentence={sentence} wordToTest={wordToTest} num={currNum}/>
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
            <Modal.Body><PaginatedDictEntries qnObjArr={wrongAnsArr}/></Modal.Body>
         </Modal>

         <Modal size="lg" centered show={isExplShown} onHide={() => setIsExplShown(!isExplShown)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Definition</Modal.Title></Modal.Header>
            <Modal.Body><DictionaryEntry qnObj={qnObj}/></Modal.Body>
         </Modal>
      </Col>
   );
};