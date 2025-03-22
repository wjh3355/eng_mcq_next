"use client";

import React, { useState, createContext, useContext, useEffect } from "react";
import {
   Cloze,
   ClozeBlankState,
   ClozeContextVal,
   UserProfileDocument,
} from "@/definitions";
import toast from "react-hot-toast";
import { updateUserClozeData } from "@/lib/mongodb/user-server-actions";

// create context, fallback is an empty context value
const ClozeContext = createContext<ClozeContextVal | null>(null);

// create hook to use context
export function useClozeContext() {
   const ctx = useContext(ClozeContext);

   if (ctx === null) {
      throw new Error("useClozeContext must be used within a ClozeProvider")
   };

   return ctx;
}

export function ClozeProvider({
   user,
   cloze,
   isDemo,
   children
}: {
   user: UserProfileDocument;
   cloze: Cloze;
   isDemo: boolean;
   children: React.ReactNode;
}): React.ReactNode {

   
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
   
   // get cloze title
   const clozeTitle = cloze.title;

   // if user is attempting demo, an empty user object is passed in --> no cloze data.
   // if not, the actual user object is passed in --> cloze data is present if they have attempted the cloze, else no cloze data.
   const userRecordForThisCloze = user.clozeData.find(cd => cd.qnNum === cloze.qnNum);
   const {
      correctAns: prevUserCorrectAnsArr
   } = userRecordForThisCloze || {}

   useEffect(() => {
      if (!userRecordForThisCloze) {
         toast("Get 8 or more blanks correct. You have 3 tries.");
      }
   }, [])

   // =================
   // INITIALISE STATES
   // =================

   // cloze state
   const [clozeState, setClozeState] = useState<ClozeBlankState[]>((() => {
         
         if (!userRecordForThisCloze) {
   
            // user has not done this cloze before
            // initialise all answers as "", and all statuses as "not submitted"

            return clozeCorrectAnsArray.map<ClozeBlankState>((correctAnsArray, idx) => ({
               blankIdx: idx,
               blankCorrectAns: correctAnsArray,
               answer: "",
               status: "not submitted"
            }));
   
         } else {
   
            // user has done this cloze before
            // initialise all answers as the user's previous answers, and all statuses as "done"
      
            return clozeCorrectAnsArray.map<ClozeBlankState>((correctAnsArray, idx) => {

               const wasCorrect = prevUserCorrectAnsArr?.includes(idx);

               return {
                  blankIdx: idx,
                  blankCorrectAns: correctAnsArray,
                  answer: "",
                  status: wasCorrect ? 'correct' : 'incorrect'
               }
            });
            
         }
   
      })()
   );

   // score out of 15
   const [score, setScore] = useState<number>(prevUserCorrectAnsArr?.length || 0);

   // was cloze submitted
   const [isClozeSubmitted, setIsClozeSubmitted] = useState<boolean>(!!userRecordForThisCloze);

   // attempts left (initially 3)
   const [triesLeft, setTriesLeft] = useState<number>(3);

   // =================
   // UTILITY FUNCTIONS
   // =================

   function handleBlankUpdate(idx: number, newAns: string) {
      setClozeState(cs => cs.map(cs => 
         cs.blankIdx === idx ? {...cs, answer: newAns } : cs
      ));
   }

   function handleResetAllBlanks() {
      setClozeState(cs => cs.map(cs => ({...cs, answer: "" }) ));
   }

   function submitCloze() {
     
      // set each blank's status to "correct" / "incorrect" 
      let clozeScore = 0;

      const submittedClozeState: ClozeBlankState[] = clozeState.map(cs => {

         const trimmedAns = cs.answer.trim();
         const rw = cs.blankCorrectAns.includes(trimmedAns);
      
         if (rw) clozeScore++;

         return { ...cs, answer: trimmedAns, status: rw ? "correct" : "incorrect" };
      })

      if (triesLeft === 1 || clozeScore >= 8) {

         // submit the cloze if user has run out of tries
         // or has gotten 8 or more correct (pass)

         setIsClozeSubmitted(true);
         setScore(clozeScore);
         setClozeState(submittedClozeState);

         if (!isDemo) {

            const correctAnsArray = submittedClozeState.reduce<number[]>((acc, cs, idx) => {
               if (cs.status === "correct") acc.push(idx);
               return acc;
            }, []);

            updateUserClozeData({
               email: user.email,
               clozeNum: cloze.qnNum,
               correctAnsArray
            })
            .then(res => {
               if ("error" in res) {
                  toast.error(res.error!);
                  return;
               }
   
               toast.success(
                  `Cloze ${cloze.qnNum} was submitted. You scored ${clozeScore} / 15.`, 
                  { duration: 8000 }
               );
   
            });

         } else {
            toast.success(
               `Cloze passage submitted. You scored ${clozeScore} / 15.`, 
               { duration: 8000 }
            );
         }

      } else {

         // decrement triesLeft

         const newTriesLeft = triesLeft - 1;

         setClozeState(submittedClozeState);
         setTriesLeft(newTriesLeft);

         toast.error(
            `Sorry, you did not pass. Get 8 or more blanks correct. You have ${newTriesLeft} tries left.`, 
            { duration: 8000 }
         );

      }

   }

   function resetCloze() {

      if (!isDemo) {

         updateUserClozeData({
            email: user.email,
            clozeNum: cloze.qnNum,
            correctAnsArray: null,
         })
         .then(res => {
            if ("error" in res) {
               toast.error(res.error!);
               return;
            }

            toast.success(`Cloze ${cloze.qnNum} reset successfully.`);   

            return new Promise(r => setTimeout(r, 1000))
         })
         .then(res => window.location.reload());

      } else {
         window.location.reload();
      }

   }

   return (
      <ClozeContext.Provider
         value={{
            clozeState,
            clozePassageArray,
            clozeTitle,
            score,
            triesLeft,
            isClozeSubmitted,
            handleBlankUpdate,
            handleResetAllBlanks,
            submitCloze,
            resetCloze
         }}
      >
         {children}
      </ClozeContext.Provider>
   )
}