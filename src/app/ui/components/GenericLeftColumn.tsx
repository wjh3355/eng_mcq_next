'use client';

import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import DropdownButton from "react-bootstrap/DropdownButton";

import DictionaryEntry from "./DictionaryEntry";
import QnSentenceFormatter from "./QnSentenceFormatter";
import PaginatedDictEntries from "./PaginatedDictEntries";
import { MCQContextValue } from '@/types';

import Skeleton from "react-loading-skeleton";
import { BadgeInfo, BookText, CircleArrowRight } from "lucide-react";

export default function GenericLeftColumn({ QnContextToUse }: { QnContextToUse: () => MCQContextValue }) {

   const {
      handleNextQnBtnClick,
      isNextQnBtnDisabled,
      score: [numCorrect, numTotal],
      wrongAnsArr,
      qnObj,
      isLoading,
      isCorrect,
      hasReachedEnd
   } = QnContextToUse();

   const { sentence, wordToTest } = qnObj;

   const [isReviewShown, setIsReviewShown] = useState(false);
   const [isExplShown, setIsExplShown] = useState(false);

   if (hasReachedEnd) return null;

   return (
      <Col lg={8} md={7}>
         <Card body className="mb-3">
            {isLoading 
               ?  <Skeleton height="24px" />
               :  <QnSentenceFormatter
                     sentence={sentence}
                     wordToTest={wordToTest}
                  />
            }
         </Card>

         <section className="hstack gap-3 mb-3">

            <DropdownButton 
               variant="warning"
               title="Score"
               drop="down"
            >
               <div className="hstack gap-3 py-1 px-3">
                  <div className="text-center">
                     Correct<br/><span className="fs-5 text-success">{numCorrect}</span>
                  </div>

                  <div className="vr"/>

                  <div className="text-center">
                     Total<br/><span className="fs-5 text-primary">{numTotal}</span>
                  </div>

                  <div className="vr"/>

                  <div className="text-center">
                     Result<br/><span className="fs-5 text-danger">{
                        numTotal === 0
                        ? 0
                        : Math.round(100*numCorrect/numTotal)
                     }%</span>
                  </div>
               </div>
            </DropdownButton>

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
               className="d-flex align-items-center justify-content-center"
               disabled={isNextQnBtnDisabled}
               onClick={() => handleNextQnBtnClick()}
            >
               <strong>Next&nbsp;</strong><CircleArrowRight size={22} strokeWidth={2}/>
            </Button>

         </section>

         <Modal size="lg" centered
            show={isReviewShown}
            onHide={() => setIsReviewShown(!isReviewShown)}
         >
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