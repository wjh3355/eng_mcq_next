"use client";

import { Cloze, MTContextValue, Question, MTState } from "@/definitions";
import { createContext, useContext, useState } from "react";

// create context, fallback is null (which will throw error)
const MTContext = createContext<MTContextValue | null>(null);

// create hook to use context
export function useMockTestContext() {
   const ctx = useContext(MTContext);

   if (ctx === null) {
      throw new Error("useMockTestContext must be used within a MockTestProvider");
   };

   return ctx;
}

export default function MockTestProvider({
   questions,
   cloze,
   children
}: {
   questions: Question[];
   cloze: Cloze;
   children: React.ReactNode
}) {

   // ================================================
   // EXTRACT THE INFO FROM THE CLOZE PASSAGE
   // ================================================

   // match all pairs of curly braces and extract the words to test (joined by "/")
   // split the words by "/" and filter out empty strings
   const clozeCorrectAnsArray = cloze.passage
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
   // note: qnIndex is 0-indexed
   const [testStates, setTestStates] = useState<MTState[]>((() => {
      const initQuestionState = questions.map((qn, idx) => ({ 
         qnIndex: idx,
         type: "question",
         qnObj: qn,
         answer: "",
         status: "not done"
      }));

      const initClozeState = clozeCorrectAnsArray.map((correctAnsArray, idx) => ({
         qnIndex: idx+questions.length,
         type: "cloze blank",
         clozeBlankCorrectAns: correctAnsArray,
         answer: "",
         status: "not done"
      }));

      return [...initQuestionState, ...initClozeState] as MTState[];
   })());

   // total length: number of questions + cloze (which is 1 page)
   const totalNumOfPages = questions.length + 1;

   // state for the current page user can see
   // 1 <= currUserPage <= totalNumOfPages
   // so qnIndex 5 corresponds to page 6
   const [currUserPage, setCurrUserPage] = useState<number>(1);

   // if the user has submitted the mock test
   const [isMTSubmitted, setIsMTSubmitted] = useState<boolean>(false);

   // final score (out of num questions + 15 (for the cloze))
   const [finalScore, setFinalScore] = useState<number>(0);

   // whether confirmation screen to submit the mock test is shown
   const [showCfmSubmitModal, setShowCfmSubmitModal] = useState<boolean>(false);

   // =================================
   // HANDLER FUNCTIONS FOR PAGE CHANGE
   // =================================

   function handleNextPgClick() {
      setCurrUserPage((prev) => Math.min(prev + 1, totalNumOfPages));
   }

   function handlePrevPgClick() {
      setCurrUserPage((prev) => Math.max(prev - 1, 1));
   }

   function handlePaginationClick(n: number) {
      setCurrUserPage(n);
   }

   // =========================
   // HANDLER TEST STATE CHANGE
   // =========================

   function handleTouched(n: number, newAnswer: string) {
      setTestStates(pv => pv.map(st => 
         st.qnIndex === n ? {...st, answer: newAnswer, status: "done"} : st
      ));
   }

   function handleReset(n: number) {
      setTestStates(pv => pv.map(st => 
         st.qnIndex === n ? {...st, answer: "", status: "not done"} : st
      ));
   }

   function handleResetAllCloze() {
      setTestStates(pv => pv.map(st => 
         st.type === "cloze blank" ? {...st, answer: "", status: "not done"} : st
      ));
   }

   // ===============================
   // HANDLER FUNCTION FOR SUBMISSION
   // ===============================

   function submitMockTest() {
      // calculate the score (each correct is +1)
      // set each question's status from "not done" / "done" to "correct" / "incorrect"
      // handle the questions / cloze blanks one by one
      setTestStates(prevTestState => {
         
         let mtScore = 0;

         const submittedTestState: MTState[] = prevTestState.map(st => {
            let rw: boolean;
            const trimmedAns = st.answer.trim();

            if (st.type === "question") {
               // question
               rw = st.qnObj.correctAns === trimmedAns;
            } else {
               // cloze blank
               rw = st.clozeBlankCorrectAns.includes(trimmedAns);
            }

            // increment score if correct
            if (rw) mtScore++;

            return {
               ...st,
               answer: trimmedAns,
               status: rw ? "correct" : "incorrect"
            }
         })

         setFinalScore(mtScore);
         setIsMTSubmitted(true);

         return submittedTestState;
      })
   }

   return (
      <MTContext.Provider
         value={{
            testStates,

            clozePassageArray,
            
            totalNumOfPages,
            currUserPage,
            
            handleNextPgClick,
            handlePrevPgClick,
            handlePaginationClick,
         
            isMTSubmitted,
            finalScore,
         
            submitMockTest,
            handleTouched,
            handleReset,
            handleResetAllCloze,
         }}
      >
         {children}
      </MTContext.Provider>
   )
}