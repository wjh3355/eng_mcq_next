"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

import { ClozeContextValue, ClozeObj, EMPTY_CLOZE_CONTEXT_VALUE, EMPTY_CLOZE_OBJ } from "@/types";

import fetchClozeFromDB from "@/serverFuncs/fetchClozeFromDB";

export default function createGenericClozeProvider() {

   const QnContext = createContext<ClozeContextValue>(EMPTY_CLOZE_CONTEXT_VALUE);

   function useClozeContext() { 
      return useContext(QnContext);
   }

   function ClozeProvider({ children }: { children: React.ReactNode }) {

      const [clozeObj, setClozeObj] = useState<ClozeObj>(EMPTY_CLOZE_OBJ);
      const [isLoading, setIsLoading] = useState<boolean>(true);
      const [error, setError] = useState<string>("");

      useEffect(() => {
         async function fetchClozeQn() {
            try {
               setClozeObj(await fetchClozeFromDB());
            } catch (error) {
               if (error instanceof Error) {
                  console.error("Error when fetching new clozeObj:", error.message);
                  setError(error.message);
               } else {
                  console.error("An unexpected error occurred:", error);
                  setError("An unexpected error occurred");
               }
            }
         };

         fetchClozeQn();
      }, [])

      useEffect(() => {
         if (!Number.isNaN(clozeObj.qnNum)) setIsLoading(false);
      }, [clozeObj])

      return (
         <QnContext.Provider value={{
            clozeObj,
            isLoading,
            error,
         }}>
            {children}
         </QnContext.Provider>
      );
   }

   return { ClozeProvider, useClozeContext };
}
