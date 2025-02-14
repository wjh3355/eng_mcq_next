"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import {
   ClozeContextValue,
   EMPTY_CLOZE_CONTEXT_VALUE,
   UserProfileDocument,
} from "@/definitions";
import { fetchCloze, fetchDemoCloze } from "@/lib/mongodb/cloze-server-actions";
import { updateUserProfile } from "@/lib/mongodb/user-server-actions";

export default function useGenericClozeProvider({
   user,
   qnNum,
   isDemo,
}: {
   user: UserProfileDocument;
   qnNum: number;
   isDemo: boolean;
}) {

   // create context, fallback is an empty context value
   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   // create hook to use context
   function useClozeContext() { return useContext(QnContext) }

   // create provider component
   function ClozeProvider({ children }: { children: React.ReactNode }) {
      const [prevUserCorrectAns, setPrevUserCorrectAns] = useState<null | number[]>(null);
      const [passageTitle, setPassageTitle] = useState<string>("");
      const [wordsToTestArr, setWordsToTestArr] = useState<string[][]>([]);
      const [textArr, setTextArr] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      function handleCompletion(correctAns: number[]) {

         // if demo, do not update user profile (there isnt one, email is empty)
         if (isDemo) {
            setPrevUserCorrectAns(correctAns);
            return;
         }

         // if not demo, update user profile with correct answer
         updateUserProfile(user.email, {
            todo: "update cloze",
            clozeQnNum: qnNum,
            correctAns,
         }).then(res => res.error && setError(res.error));
      }

      function handleReset() {

         // if demo, set prevUserCorrectAns to null
         if (isDemo) {
            setPrevUserCorrectAns(null);
            return;
         }

         // if not demo, update user profile by deleting the cloze entry
         updateUserProfile(user.email, {
            todo: "update cloze",
            clozeQnNum: qnNum,
            correctAns: null,
         }).then(res => res.error && setError(res.error));
      }

      useEffect(() => {

         const fetchData = async() => {
            // if user is attempting demo, an empty user object is passed in --> correctAns is null
            // if not, the actual user object is passed in --> correctAns for this cloze number is 
            // either the user's previous correct answer or null if the user has not attempted the question before
            const userDataForThisCloze = user.clozeData.find(cz => cz.qnNum === qnNum);
            setPrevUserCorrectAns(userDataForThisCloze?.correctAns || null);

            // if demo, fetch demo cloze (qnNum = 1), else fetch actual cloze based on qnNum
            const clozePromise = isDemo ? fetchDemoCloze() : fetchCloze(qnNum);

            try {

               // wait for cloze data to be fetched
               const res = await clozePromise;

               // if error, set error message
               if ( "error" in res ) {
                  setError(res.error);
                  return;
               }

               // match all pairs of curly braces and extract the words to test (joined by "/")
               // split the words by "/" and filter out empty strings
               setWordsToTestArr(
                  res.passage
                     .match(/\{[^}]*\}/g)!
                     .map((match) =>
                        match.slice(1, -1).split("/").filter(Boolean)
                     )
               );
   
               // replace all curly braces with "BLANK"
               // split the passage by "BLANK" and "||" ("||" is used to separate paragraphs)
               // "BLANK" and "||"" are included in the split array
               // filter out empty strings
               setTextArr(
                  res.passage
                     .replace(/{.*?}/g, "BLANK")
                     .split(/(BLANK|\|\|)/)
                     .filter(Boolean)
               );
   
               // set the passage title
               setPassageTitle(res.title);

            } catch (err) {
               setError(err instanceof Error ? err.message : "An unknown error occurred");
            }

         }

         fetchData();
         
      }, []);

      useEffect(() => {
         // if all data is loaded, set isLoading to false
         // prevent loading spinner from showing when data is already loaded
         if (
            passageTitle.length > 0 &&
            textArr.length > 0 &&
            wordsToTestArr.length > 0
         )
            setIsLoading(false);
      }, [passageTitle, textArr, wordsToTestArr]);

      return (
         <QnContext.Provider
            value={{
               isDemo,
               prevUserCorrectAns,
               wordsToTestArr,
               textArr,
               qnNum,
               passageTitle,
               isLoading,
               error,
               handleCompletion,
               handleReset,
            }}
         >
            {children}
         </QnContext.Provider>
      );
   }

   return { useClozeContext, ClozeProvider };
}
