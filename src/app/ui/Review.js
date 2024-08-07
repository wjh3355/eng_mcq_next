'use client';

import { Card } from "react-bootstrap";
import React, { memo } from "react";

import { useGEPQnContext } from "../utils/GEPQnProvider";

const Review = memo(function Review() {
   const { wrongAnsArr } = useGEPQnContext();

   function generateWrongAnsCards(obj) {
      const { sentence, rootWord, wordToTest, def } = obj;
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
                  className="fst-italic py-2 px-4 rounded-5 border-bottom border-2"
                  style={{ backgroundColor: "#ffe484" }}
               >
                  <strong>{rootWord}</strong>: {def}.
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
})

function WrongAnsPlaceholder() {
   return (
      <div className="d-flex justify-content-center">
         <p className="text-secondary fst-italic my-3">
            Incorrect answers will be displayed here.
         </p>
      </div>
   );
}

export default Review;