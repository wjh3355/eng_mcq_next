"use client";

import { Cloze, Question } from "@/definitions";
import { useState } from "react";
import { ClozeBlankState, QuestionState } from "./MTClientComponent";
import { cloneDeep } from "lodash";

export default function useMockTest({
   questions,
   cloze,
}: {
   questions: Question[];
   cloze: Cloze;
}) {

   // ================================================
   // EXTRACT THE INFO FROM THE CLOZE PASSAGE
   // ================================================

   // match all pairs of curly braces and extract the words to test (joined by "/")
   // split the words by "/" and filter out empty strings
   const clozeWordsToTestArray = cloze.passage
      .match(/\{[^}]*\}/g)!
      .map((match) =>
         match.slice(1, -1).split("/").filter(Boolean)
      );

   // replace all curly braces with "BLANK"
   // split the passage by "BLANK" and "||" ("||" is used to separate paragraphs)
   // "BLANK" and "||" are included in the split array
   // filter out empty strings
   const clozePassageArray = cloze.passage
      .replace(/{.*?}/g, "BLANK")
      .split(/(BLANK|\|\|)/)
      .filter(Boolean);
   
   // =================
   // INITIALISE STATES
   // =================

   // state for the questions
   const [questionsState, setQuestionsState] = useState<QuestionState[]>(questions.map((qn, idx) => (
      { mockTestQnNum: idx+1, qnObj: qn, answer: "", status: "not done" }
   )));

   // state for the cloze blanks
   // qnNums will start from 1 + number of previous questions
   // if there are 10 questions, the first cloze blank will have qnNum = 11
   const [clozeState, setClozeState] = useState<ClozeBlankState[]>(clozeWordsToTestArray.map((correctAnsArray, idx) => (
      { mockTestQnNum: idx+1+questions.length, correctAnsArray, answer: "", status: "not done" }
   )));

   // total length: number of questions + cloze (which is 1 page)
   const totalNumOfPages = questions.length + 1;

   // state for the current page (1 <= currentPage <= totalNumOfPages)
   const [currentPage, setCurrentPage] = useState<number>(1);

   // if the user has submitted the mock test
   const [hasBeenSubmitted, setHasBeenSubmitted] = useState<boolean>(false);

   // final score (out of num questions + 15 (for the cloze))
   const [finalScore, setFinalScore] = useState<number>(0);

   // whether confirmation screen to submit the mock test is shown
   const [showCfmSubmitModal, setShowCfmSubmitModal] = useState<boolean>(false);

   // =================================
   // HANDLER FUNCTIONS FOR PAGE CHANGE
   // =================================

   function handleNextClick() {
      setCurrentPage((prev) => Math.min(prev + 1, totalNumOfPages));
   }

   function handlePreviousClick() {
      setCurrentPage((prev) => Math.max(prev - 1, 1));
   }

   // ================================
   // HANDLER FUNCTIONS FOR SUBMISSION
   // ================================

   function submitMockTest() {
      // calculate the score (each correct is +1)
      // set each question's status from "not done" / "done" to "correct" / "incorrect"
      let mtScore = 0;

      // handle the questions one by one
      const submittedQuestionsState = cloneDeep(questionsState);
      for (let i in submittedQuestionsState) {
         const { qnObj, answer } = submittedQuestionsState[i];
         const { kindOfQn, correctAns } = qnObj;

         // right or wrong?
         let rw: boolean

         // handle spelling differently because only 1 correct answer
         if (kindOfQn === "spelling") {
            rw = correctAns === answer.trim();
         } else {
            rw = correctAns === answer;
         }

         // update status and score
         if (rw) {
            mtScore++;
            submittedQuestionsState[i].status = "correct";
         } else {
            submittedQuestionsState[i].status = "incorrect";
         }
      }

      setQuestionsState(submittedQuestionsState);

      // handle the cloze blanks one by one
      const submittedClozeState = cloneDeep(clozeState);
      for (let i in submittedClozeState) {
         const { correctAnsArray, answer } = submittedClozeState[i];

         // right or wrong?
         const trimmedAns = answer.trim();
         const rw = correctAnsArray.includes(trimmedAns);

         // replace the answer with the trimmed
         submittedClozeState[i].answer = trimmedAns;

         // update status and score
         if (rw) {
            mtScore++;
            submittedClozeState[i].status = "correct";
         } else {
            submittedClozeState[i].status = "incorrect";
         }
      }

      setClozeState(submittedClozeState);

      // set the final score
      setFinalScore(mtScore);
      setHasBeenSubmitted(true);
   }

   return {
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
      submitMockTest
   }
}