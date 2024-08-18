'use client';

import { Card } from "react-bootstrap";

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";
import { QnObjType } from "@/lib/types";
import SentenceFormatter from "@/app/ui/utils/SentenceFormatter";
import ReviewPlaceholder from "@/app/ui/utils/ReviewPlaceholder";

export default function Review() {
   const { wrongAnsArr } = useGEP_VOCAB_QnContext();

   function generateWrongAnsCards(qnObj: QnObjType) {
      const { sentence, rootWord, wordToTest, def } = qnObj;
      return (
         <Card body className="w-100 mb-3" key={rootWord}>
            <p>
               <SentenceFormatter
                  sentence={sentence}
                  wordToTest={wordToTest}
               />
            </p>
            <div className="d-flex justify-content-center">
               <div
                  className="py-2 px-4 rounded-5 border-bottom border-2"
                  style={{ backgroundColor: "#ffe484" }}
               >
                  <strong>{rootWord}</strong>: {def}
               </div>
            </div>
         </Card>
      );
   }

   if (wrongAnsArr.length === 0) return <ReviewPlaceholder/>;

   return <>{wrongAnsArr.map(generateWrongAnsCards)}</>;
};