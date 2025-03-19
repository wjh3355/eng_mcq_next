"use client";

import { Cloze, MTContextValue, Question, MTState, UserProfileDocument, Collections, MockTestUserDat } from "@/definitions";
import { updateUserMockTestData } from "@/lib/mongodb/user-server-actions";
import { createContext, useContext, useState } from "react";
import toast from "react-hot-toast";

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
   user,
   MTnum,
   children
}: {
   questions: Partial<Record<Collections, Question[]>>;
   cloze: Cloze;
   user: UserProfileDocument;
   MTnum: number;
   children: React.ReactNode;
}) {

   const flattenedQuestions = (Object.entries(questions) as [ Collections, Question[] ][]).flatMap(([col, qns]) => qns.map(qn => ({ col, qn })));

   // ======================================
   // GET USER DATA FOR THIS MTEST IF EXISTS
   // ======================================

   const userRecordForThisMT = user.mockTestData?.find(mt => mt.mockTestNumber === MTnum);

   const {
      score: prevUserScore,
      wrongQuestions: prevUserWrongQns,
      clozeData: prevUserClozeData
   } = userRecordForThisMT || {};

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
      
      if (!userRecordForThisMT) {

         // user has not done this mock test before
         // initialise all answers as "", and all statuses as "not done"
         const initQuestionState = flattenedQuestions.map<MTState>(({ col, qn }, idx) => ({ 
            qnIndex: idx,
            type: "question",
            collection: col,
            qnObj: qn,
            answer: "",
            status: "not done"
         }));
   
         const initClozeState = clozeCorrectAnsArray.map<MTState>((correctAnsArray, idx) => ({
            qnIndex: idx+flattenedQuestions.length,
            type: "cloze blank",
            clozeBlankCorrectAns: correctAnsArray,
            answer: "",
            status: "not done"
         }));
   
         return [...initQuestionState, ...initClozeState];

      } else {

         // user has done this mock test before
         // initialise all answers as the user's previous answers, and all statuses as "done"

         const initQuestionState = flattenedQuestions.map<MTState>(({ col, qn }, idx) => {
            
            // check if this question is among the wrong questions
            const wrongQnData = prevUserWrongQns?.find(wq => wq.qnNum === qn.qnNum && wq.col === col);
            
            if (wrongQnData) {
               // user got this question wrong
               // status is "incorrect", answer is .userWrongAns
               return { 
                  qnIndex: idx,
                  type: "question",
                  collection: col,
                  qnObj: qn,
                  answer: wrongQnData.userWrongAns,
                  status: "incorrect"
               }
            } else {
               // user got this question correct
               // status is "correct", answer is .correctAns
               return { 
                  qnIndex: idx,
                  type: "question",
                  collection: col,
                  qnObj: qn,
                  answer: qn.correctAns,
                  status: "correct"
               }
            }

         });

         const initClozeState = clozeCorrectAnsArray.map<MTState>((correctAnsArray, idx) => {

            // check if this cloze blank is among the correct cloze blanks
            const wrongClozeBlankData = prevUserClozeData?.find(dat => dat.blankNum = idx)!;

            return {
               qnIndex: idx+flattenedQuestions.length,
               type: "cloze blank",
               clozeBlankCorrectAns: correctAnsArray,
               answer: wrongClozeBlankData.ans,
               status: wrongClozeBlankData.isCorrect ? "correct" : "incorrect"
            }

         });
         
         return [...initQuestionState, ...initClozeState];
      }

   })());

   // total length: number of questions + cloze (which is 1 page)
   const totalNumOfPages = flattenedQuestions.length + 1;

   // state for the current page user can see
   // 1 <= currUserPage <= totalNumOfPages
   // so qnIndex 5 corresponds to page 6
   const [currUserPage, setCurrUserPage] = useState<number>(1);

   // if the user has done the mock test
   const [isMTSubmitted, setIsMTSubmitted] = useState<boolean>(userRecordForThisMT ? true : false);

   // final score (out of num questions + 15 (for the cloze))
   const [finalScore, setFinalScore] = useState<number>(prevUserScore || 0);

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
      let mtScore = 0;

      const submittedTestState: MTState[] = testStates.map(st => {
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
      setTestStates(submittedTestState);

      const newMTUserDat: MockTestUserDat = {
         mockTestNumber: MTnum,
         score: mtScore,
         wrongQuestions: submittedTestState
            .filter(st => st.status === "incorrect")
            .filter(st => st.type === "question")
            .map(wqs => ({
               col: wqs.collection,
               qnNum: wqs.qnObj.qnNum,
               userWrongAns: wqs.answer
            })),
         clozeData: submittedTestState
            .filter(st => st.type === "cloze blank")
            .map((st, idx) => ({
               blankNum: idx,
               ans: st.answer,
               isCorrect: st.status === "correct"
            }))
      }

      updateUserMockTestData({ email: user.email, MTnum, newMTUserDat })
      .then(res => {
         if ("error" in res) {
            toast.error(res.error!);
            return;
         }

         toast.success("Mock test submitted successfully.");
         
      });
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