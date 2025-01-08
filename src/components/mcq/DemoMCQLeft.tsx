'use client';

import React, { useState } from "react";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import DropdownButton from "react-bootstrap/DropdownButton";

import DictionaryEntry from "../DictionaryEntry";
import MCQQnSentence from "./MCQQnSentence";
import PaginatedDictEntries from "../PaginatedDictEntries";
import { DEMO_DATA, MCQContextValue } from '@/types';

import Skeleton from "react-loading-skeleton";
import { BadgeInfo, BookText, CircleArrowRight } from "lucide-react";

export default function DemoMCQLeft({ QnContextToUse }: { QnContextToUse: () => MCQContextValue }) {

   const {
      handleNextQnBtnClick,
      thisSessionScore: [numCorrect, numTotal],
      wrongAnsArr,
      qnObj,
      isLoading,
      isCorrect,
      hasReachedEnd
   } = QnContextToUse();

   const { sentence, wordToTest, qnNum } = qnObj;

   const [isReviewShown, setIsReviewShown] = useState(false);
   const [isExplShown, setIsExplShown] = useState(false);
   const [isHelpShown, setIsHelpShown] = useState(false);

   if (hasReachedEnd) return null;

   return (
      <Col lg={8} md={7}>
         <Card className="mb-3">
            {isLoading
               ?  <Card.Body>
                     <Skeleton height="24px" />
                  </Card.Body>
               :  <>
                     <Card.Header>
                        <small>From {DEMO_DATA.getDemoQnCat(qnNum)}</small>
                     </Card.Header>
                     <Card.Body>
                        <MCQQnSentence sentence={sentence} wordToTest={wordToTest}/>
                     </Card.Body>
                  </>
            }
         </Card>

         <section className="hstack gap-3 mb-3">

            <DropdownButton variant="warning" title="Results" drop="down">
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
                     Percentage<br/><span className="fs-5 text-danger">{
                        numTotal === 0
                        ? 0
                        : Math.round(100*numCorrect/numTotal)
                     }%</span>
                  </div>
               </div>
            </DropdownButton>

            <Button variant="link" className="ms-auto p-0" onClick={() => setIsHelpShown(true)}>
               Help
            </Button>

            <button 
               className="border-0 bg-transparent p-0"
               disabled={isCorrect === null}
               onClick={() => setIsExplShown(true)}
            >
               <BadgeInfo size={25} strokeWidth={2}/>
            </button>

            <button 
               className="border-0 bg-transparent p-0"
               disabled={wrongAnsArr.length === 0}
               onClick={() => setIsReviewShown(true)}
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

         <Modal size="lg" centered show={isReviewShown} onHide={() => setIsReviewShown(false)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Review Incorrect Questions</Modal.Title></Modal.Header>
            <Modal.Body><PaginatedDictEntries qnObjArr={wrongAnsArr}/></Modal.Body>
         </Modal>

         <Modal size="lg" centered show={isExplShown} onHide={() => setIsExplShown(false)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Definition</Modal.Title></Modal.Header>
            <Modal.Body><DictionaryEntry qnObj={qnObj}/></Modal.Body>
         </Modal>

         <Modal size="lg" centered show={isHelpShown} onHide={() => setIsHelpShown(false)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Help</Modal.Title></Modal.Header>
            <Modal.Body style={{textAlign: "justify", lineHeight: "25px"}}>
               <p>You will be presented with a series of MCQ questions that test vocabulary or grammar.</p>
               <ul>
                  <li>If there is a <strong>bolded</strong> word or phrase in the sentence, choose the option closest in meaning to it.</li>
                  <li>If there is a <u>blank</u> in the sentence, choose the option that best fits the blank.</li>
               </ul>
               <p>
                  If the option you selected was correct, it will become <strong style={{ color: "green" }}>green</strong>. Otherwise, it will become <strong style={{ color: "rgb(190, 44, 44)" }}>red</strong> and the correct option will be indicated in <strong style={{ color: "green" }}>green</strong>.
               </p>
               <p>
                  The <BadgeInfo size={21} strokeWidth={2}/> icon displays the definition of the word/phrase tested in the question, while <BookText size={21} strokeWidth={2}/> keeps track of all the questions you answered wrongly. Clicking
                  <Button 
                     variant="primary"
                     size="sm"
                     className="d-inline mx-2"
                  >
                     Next&nbsp;<CircleArrowRight size={20} strokeWidth={2} className="my-auto"/>
                  </Button>
                  displays the next question (once you answered the current one).
               </p>
               <p>
                  You may click
                  <Button variant="warning" className="d-inline mx-2" size="sm">Results</Button>
                  at any time to view your current score.            
               </p>
            </Modal.Body>
         </Modal>
      </Col>
   );
};