"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { ClozeContextValue, ClozeData, ClozeObj, EMPTY_CLOZE_CONTEXT_VALUE, EMPTY_CLOZE_DATA, EMPTY_CLOZE_OBJ } from "@/types";
import fetchClozeFromDB from "@/serverFuncs/fetchClozeFromDB";
import fetchUserData from "@/serverFuncs/fetchUserData";
import updateUserClozeData from "@/serverFuncs/updateUserClozeData";

export default function createGenericClozeProvider(userName: string) {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [clozeData, setClozeData] = useState<ClozeData>(EMPTY_CLOZE_DATA);
      const [clozeObj, setClozeObj] = useState<ClozeObj>(EMPTY_CLOZE_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      async function handleCompletion(score: number) {
         try {
            await updateUserClozeData({
               userName,
               score
            });
         } catch (error) {
            console.error("Error updating user data:", error);
            setError("Error updating user data");
         }
      }

      useEffect(() => {

         (async () => {
            try {
               setClozeData((await fetchUserData(userName)).clozeData);
               setClozeObj(await fetchClozeFromDB());
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
         if (!Number.isNaN(clozeObj.qnNum)) setIsLoading(false);
      }, [clozeObj])

      return (
         <QnContext.Provider value={{
            clozeData,
            clozeObj,
            isLoading,
            error,
            handleCompletion
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { useClozeContext, ClozeProvider };

}
