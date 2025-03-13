"use client";

import { Cloze, Question } from "@/definitions";
import MTQuestion from "./MTQuestion";
import { MTCloze } from "./MTCloze";
import useMockTest from "./useMockTest";

import React, { useState, memo } from "react";

import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";

export type QuestionState = {
   mockTestQnNum: number;
   qnObj: Question;
   answer: string;
   status: "not done" | "done" | "correct" | "incorrect";
};

export type ClozeBlankState= {
   mockTestQnNum: number;
   correctAnsArray: string[];
   answer: string;
   status: "not done" | "done" | "correct" | "incorrect";
};

export default function MTClientComponent({
   questions,
   cloze,
}: {
   questions: Question[];
   cloze: Cloze;
}) {

   const {
      clozePassageArray,

      questionsState,
      setQuestionsState,

      clozeState,
      setClozeState,

      totalNumOfPages,

      currentPage,
      setCurrentPage,

      hasBeenSubmitted,

      finalScore,

      showCfmSubmitModal,
      setShowCfmSubmitModal,

      handleNextClick,
      handlePreviousClick,
      submitMockTest,
   } = useMockTest({ questions, cloze });

   // ========================
   // COMPONENT FOR PAGINATION
   // ========================

   const PageNums = memo(() => {
      // Pagination

      const pageNumbers: React.ReactNode[] = [];
      for (let thisPage = 1; thisPage <= totalNumOfPages; thisPage++) {

         if (thisPage !== totalNumOfPages) {
            // for questions

            let bgColour = '';
            switch (questionsState[thisPage-1].status) {
               case "not done":
                  bgColour = 'lightgray';
                  break;
               case "done":
                  bgColour = 'lightblue';
                  break;
               case "correct":
                  bgColour = 'lightgreen';
                  break;
               case "incorrect":
                  bgColour = 'orangered';
                  break;
            }

            pageNumbers.push(
               <button
                  key={thisPage}
                  style={{ width: "30px", height: "30px", backgroundColor: bgColour }}
                  onClick={() => setCurrentPage(thisPage)}
                  className={currentPage === thisPage ? 'fw-bold' : ''}
               >
                  {thisPage}
               </button>
            );
         } else {
            // for cloze

            // if none attempted: lightgray
            // if all attempted: lightblue
            // if 8 or more correct: lightgreen
            // if less than 8 correct: orangered
            let bgColour = '';
            if (clozeState.some(thisClozeState => thisClozeState.status === "not done")) {
               bgColour = 'lightgray';
            } else if (clozeState.every(thisClozeState => thisClozeState.status === "done")) {
               bgColour = 'lightblue';
            } else if (clozeState.filter(thisClozeState => thisClozeState.status === "correct").length >= 8) {
               bgColour = 'lightgreen';
            } else {
               bgColour = 'orangered';
            }

            pageNumbers.push(
               <button
                  key={thisPage}
                  style={{ width: "30px", height: "30px", backgroundColor: bgColour }}
                  onClick={() => setCurrentPage(thisPage)}
                  className={currentPage === thisPage ? 'fw-bold' : ''}
               >
                  {thisPage}
               </button>
            );
         }

      }
      return pageNumbers;
   });

   PageNums.displayName = 'PageNums';

   // =======================
   // ACTUAL RETURN COMPONENT
   // =======================

   return (
      <Container>
         <Row>
            {questionsState.map((thisQnState, idx) => 
               <MTQuestion
                  key={idx}
                  currentPage={currentPage}
                  thisQnState={thisQnState}
                  handleNextClick={handleNextClick}
                  handlePreviousClick={handlePreviousClick}
                  hasBeenSubmitted={hasBeenSubmitted}
                  handleQuestionTouched={(newAns) => {
                     setQuestionsState((prev) => {
                        const newQuestionsState = [...prev];
                        newQuestionsState[idx] = {
                           ...newQuestionsState[idx],
                           answer: newAns,
                           status: "done"
                        };
                        return newQuestionsState;
                     });
                  }}
                  handleQnReset={() => {
                     setQuestionsState((prev) => {
                        const newQuestionsState = [...prev];
                        newQuestionsState[idx] = {
                           ...newQuestionsState[idx],
                           answer: "",
                           status: "not done"
                        };
                        return newQuestionsState;
                     });
                  }}
               />
            )}
            {currentPage === totalNumOfPages &&
               <MTCloze
                  hasBeenSubmitted={hasBeenSubmitted}
                  clozePassageArray={clozePassageArray}
                  clozeState={clozeState}
                  handlePreviousClick={handlePreviousClick}
                  handleClozeInputUpdate={(e) => {

                     const { name, value: newAns } = e.target;

                     const blankIdx = parseInt(name);

                     setClozeState((prev) => {
                        const newClozeState = [...prev];
                        newClozeState[blankIdx] = {
                           ...newClozeState[blankIdx],
                           answer: newAns,
                           status: "done"
                        };
                        return newClozeState;
                     });
                  }}
                  handleResetCloze={() => {
                     setClozeState((prev) => {
                        const newClozeState = [...prev];
                        for (let i in newClozeState) {
                           newClozeState[i].answer = "";
                           newClozeState[i].status = "not done";
                        }
                        return newClozeState;
                     });
                  }}
               />
            }
         </Row>
         <Row>
            <Col>
               <PageNums/>
            </Col>
         </Row>
         <Row>
            <Col>
               <Button
                  disabled={hasBeenSubmitted}
                  variant="danger"
                  onClick={() => setShowCfmSubmitModal(true)}
               >
                  Submit
               </Button>

               {
                  hasBeenSubmitted &&
                  <div className="mt-3">
                     <p className="fs-5">Final Score: {finalScore} / {questions.length + 15}</p>
                  </div>
               }

            </Col>


         </Row>

         <Modal size="lg" centered show={showCfmSubmitModal} onHide={() => setShowCfmSubmitModal(false)} backdrop="static">
            <Modal.Header><Modal.Title className="fs-5">Submit Mock Test</Modal.Title></Modal.Header>
            <Modal.Body>
               <p className="text-center mb-3">Are you sure you want to submit the mock test? Some questions might be blank (in blue)</p>

               <div className="d-flex justify-content-center gap-3">
                  <Button 
                     variant="danger"
                     onClick={() => setShowCfmSubmitModal(false)}
                  >
                     Cancel
                  </Button>
                  <Button 
                     variant="light"
                     onClick={() => {
                        setShowCfmSubmitModal(false);
                        submitMockTest();
                     }}
                  >
                     Submit
                  </Button>
               </div>
            </Modal.Body>
         </Modal>
      </Container>
   );
}