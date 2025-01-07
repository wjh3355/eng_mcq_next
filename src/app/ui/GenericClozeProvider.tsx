"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { ClozeContextValue, EMPTY_CLOZE_CONTEXT_VALUE } from "@/types";
import { fetchCloze } from "@/serverFuncs/clozeActions";
import fetchUserData from "@/serverFuncs/fetchUserData";
import updateUserClozeData from "@/serverFuncs/updateUserClozeData";

export default function createGenericClozeProvider({
   qnNumToFetch,
   userName 
}: { 
   userName: string
   qnNumToFetch: number
}) {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [prevUserCorrectAns, setPrevUserCorrectAns] = useState<null | number[]>(null);
      const [qnNum, setQnNum] = useState<number>(qnNumToFetch);
      const [title, setTitle] = useState<string>("");
      const [wordsToTestArr, setWordsToTestArr] = useState<string[][]>([]);
      const [textArr, setTextArr] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      async function handleCompletion(correctAns: number[]) {
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

      async function handleReset() {
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

      useEffect(() => {

         (async () => {
            try {
               const userClozeData = (await fetchUserData(userName)).clozeData;

               const { passage, qnNum, title } = await fetchCloze(qnNumToFetch);

               setWordsToTestArr(
                  passage
                     .match(/\{[^}]*\}/g)!
                     .map(match => match
                        .slice(1, -1)
                        .split("/")
                        .filter(Boolean)
                     )
               );

               setTextArr(
                  passage
                     .replace(/{.*?}/g, "BLANK")
                     .split(/(BLANK|\|\|)/)
                     .filter(Boolean)
               );

               setPrevUserCorrectAns(
                  userClozeData
                     .find(cz => cz.qnNum === qnNum)
                     ?.correctAns || null
               );

               setTitle(title);
               setQnNum(qnNum);

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
            !Number.isNaN(qnNum)
            && title.length > 0
            && textArr.length > 0
            && wordsToTestArr.length > 0
         ) setIsLoading(false);
      }, [qnNum, title, textArr, wordsToTestArr])

      return (
         <QnContext.Provider value={{
            prevUserCorrectAns,
            wordsToTestArr,
            textArr,
            qnNum,
            title,
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
