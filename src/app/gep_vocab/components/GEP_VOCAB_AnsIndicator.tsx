'use client';

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";
import { RightAnsIndicator, WrongAnsIndicator } from "@/app/ui/utils/AnsIndicators";

export default function GEP_VOCAB_AnsIndicator() {
   const { isCorrect } = useGEP_VOCAB_QnContext();

   switch (isCorrect) {
      case true:
         return (
            <RightAnsIndicator/>
         );
      case false:
         return (
            <WrongAnsIndicator/>
         );
      case null:
         return null;
   }
}