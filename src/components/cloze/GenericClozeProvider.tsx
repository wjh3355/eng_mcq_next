"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { ClozeContextValue, EMPTY_CLOZE_CONTEXT_VALUE } from "@/types";
import { fetchCloze } from "@/utils/clozeActions";
import fetchUserData from "@/utils/fetchUserData";
import { updateUserClozeData } from "@/utils/updateUserData";

export default function createGenericClozeProvider({
   qnNum,
   userName,
   isDemo
}: { 
   userName: string
   qnNum: number,
   isDemo: boolean
}) {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [prevUserCorrectAns, setPrevUserCorrectAns] = useState<null | number[]>(null);
      const [passageTitle, setPassageTitle] = useState<string>("");
      const [wordsToTestArr, setWordsToTestArr] = useState<string[][]>([]);
      const [textArr, setTextArr] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      async function handleCompletion(correctAns: number[]) {
         if (isDemo) {
            setPrevUserCorrectAns(correctAns);
         } else {
            try {
               await updateUserClozeData({
                  userName,
                  qnNum,
                  correctAns
               });
            } catch (error) {
               console.error("Error updating user data:", error);
               setError("Error updating user data");
            }
         }
      }

      async function handleReset() {
         if (isDemo) {
            setPrevUserCorrectAns(null);
         } else {
            try {
               await updateUserClozeData({
                  userName,
                  qnNum
               });
               window.location.reload();
            } catch (error){
               console.error("Error resetting user data:", error);
               setError("Error resetting user data");
            }
         }
      }

      useEffect(() => {

         (async () => {
            try {

               if (!isDemo) {
                  const userClozeData = (await fetchUserData(userName)).clozeData;
                  const userDataForCurrentCloze = userClozeData.find(cz => cz.qnNum === qnNum);
                  setPrevUserCorrectAns(userDataForCurrentCloze?.correctAns || null);
               }

               const cloze = await fetchCloze(qnNum);

               setWordsToTestArr(
                  cloze.passage
                     .match(/\{[^}]*\}/g)!
                     .map(match => match
                        .slice(1, -1)
                        .split("/")
                        .filter(Boolean)
                     )
               );

               setTextArr(
                  cloze.passage
                     .replace(/{.*?}/g, "BLANK")
                     .split(/(BLANK|\|\|)/)
                     .filter(Boolean)
               );

               setPassageTitle(cloze.title);

            } catch (error) {
               if (error instanceof Error) {
                  console.error("Error when fetching cloze or user data:", error.message);
                  setError(error.message);
               } else {
                  console.error("An unexpected error occurred:", error);
                  setError("An unexpected error occurred");
               }
            }
         })()

      }, [])

      useEffect(() => {
         if (
            passageTitle.length > 0
            && textArr.length > 0
            && wordsToTestArr.length > 0
         ) setIsLoading(false);
      }, [passageTitle, textArr, wordsToTestArr])

      return (
         <QnContext.Provider value={{
            isDemo,
            prevUserCorrectAns,
            wordsToTestArr,
            textArr,
            qnNum,
            passageTitle,
            isLoading,
            error,
            handleCompletion,
            handleReset
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { useClozeContext, ClozeProvider };

}
