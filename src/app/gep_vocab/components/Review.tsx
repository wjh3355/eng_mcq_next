'use client';

import { Card } from "react-bootstrap";

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";
import { QnObjType } from "@/lib/types";

export default function Review() {
   const { wrongAnsArr } = useGEP_VOCAB_QnContext();

   function generateWrongAnsCards(qnObj: QnObjType) {
      const { sentence, rootWord, wordToTest, def } = qnObj;
      const idxOfWord = sentence.indexOf(wordToTest);
      return (
         <Card body className="w-100 mb-3" key={rootWord}>
            <p>
               {sentence.slice(0, idxOfWord)}
               <strong className="text-danger">{wordToTest}</strong>
               {sentence.slice(idxOfWord + wordToTest.length)}
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

   return (
      <>
         {wrongAnsArr.length > 0
            ? wrongAnsArr.map(generateWrongAnsCards)
            : <WrongAnsPlaceholder/>
         }
      </>
   );
};

function WrongAnsPlaceholder() {
   return (
      <div className="d-flex justify-content-center">
         <p className="text-secondary fst-italic my-3">
            All incorrect answers will be listed here for your review.
         </p>
      </div>
   );
};