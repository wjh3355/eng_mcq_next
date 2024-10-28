"use client";

import { useEffect, useState } from "react";
import { MCQContextValue } from '@/types';

export default function GenericQnStopwatch({ 
   QnContextToUse 
}: {
   QnContextToUse: () => MCQContextValue
}) {
   const { isLoading, isCorrect } = QnContextToUse();

   const [sec, setSec] = useState<number>(0);

   useEffect(() => {
      let intervalId: ReturnType<typeof setInterval> | undefined;

      if (!isLoading && isCorrect === null) {
         setSec(0);
         intervalId = setInterval(
            () => setSec(prev => prev + 1), 
            1000
         );
      }

      return () => {
         if (intervalId) {
            clearInterval(intervalId);
         }
      };
   }, [isLoading, isCorrect]);

   if (isLoading) return <>Loading...</>

   return ( 
      <>
         {isCorrect === null ? "Time elapsed: " : "You took: "}
         {sec} sec
      </>
   );
}