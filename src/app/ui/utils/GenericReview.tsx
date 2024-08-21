'use client';

import { Card } from "react-bootstrap";

import { QnObjType } from "@/lib/types";
import SentenceFormatter from "@/app/ui/utils/SentenceFormatter";

export default function GenericReview({wrongAnsArr}: {wrongAnsArr: QnObjType[]}) {

   function generateWrongAnsCards(qnObj: QnObjType) {
      const { sentence, rootWord, wordToTest, def, correctAns } = qnObj;
      return (
         <Card body className="w-100" key={rootWord}>
            <SentenceFormatter
               sentence={sentence}
               wordToTest={wordToTest}
               correctAns={correctAns}
            />
            <div className="d-flex justify-content-center mt-3">
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

   return (
      <div className="vstack gap-3">
         {wrongAnsArr.map(generateWrongAnsCards)}
      </div>
   );
};

function ReviewPlaceholder() {
   return (
      <div className="d-flex justify-content-center">
         <p className="text-secondary fst-italic my-3">
            All incorrect answers will be listed here for your review.
         </p>
      </div>
   );
};