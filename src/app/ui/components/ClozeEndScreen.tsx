"use client";

import { ClozeContextValue } from "@/types";

export default function ClozeEndScreen({ QnContextToUse }: { QnContextToUse: () => ClozeContextValue }) {

   const { 
      hasReachedEnd,
   } = QnContextToUse();

   if (!hasReachedEnd) return null;

   return (
      <h1>You have reached the end.</h1>
   )
}