"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { ClozeContextValue, UserClozeData, EMPTY_CLOZE_CONTEXT_VALUE, EMPTY_USER_CLOZE_DATA } from "@/types";
import fetchClozeFromDB from "@/serverFuncs/fetchClozeFromDB";
import fetchUserData from "@/serverFuncs/fetchUserData";
import updateUserClozeData from "@/serverFuncs/updateUserClozeData";

export default function createGenericClozeProvider(userName: string) {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [userClozeData, setUserClozeData] = useState<UserClozeData>(EMPTY_USER_CLOZE_DATA);
      const [qnNum, setQnNum] = useState<number>(NaN);
      const [wordsToTestArr, setWordsToTestArr] = useState<string[][]>([]);
      const [textArr, setTextArr] = useState<string[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      async function handleCompletion(correctAns: number[]) {
         try {
            await updateUserClozeData({
               userName,
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
               userName
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
               setUserClozeData((await fetchUserData(userName)).clozeData);

               const { passage, qnNum } = await fetchClozeFromDB();

               setWordsToTestArr(
                  passage
                     .match(/\{[^}]*\}/g)!
                     .map(match => 
                        [...match
                           .slice(1, -1)
                           .split("/")
                           .filter(word => word !== "")
                     ]
                     )
               );

               setTextArr(
                  passage.split(/\{[^}]*\}/g)
               );

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
         if (!Number.isNaN(qnNum)) setIsLoading(false);
      }, [qnNum])

      return (
         <QnContext.Provider value={{
            userClozeData,
            wordsToTestArr,
            textArr,
            qnNum,
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
