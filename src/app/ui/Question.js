'use client';

import { useGEPQnContext } from "../utils/GEPQnProvider";
import { memo } from "react";

const Question = memo(function Question() {

   const { qnObj: { sentence, wordToTest } } = useGEPQnContext();

   const idxOfWord = sentence.indexOf(wordToTest);

   return (
      <div className="fs-5">
        {sentence.slice(0, idxOfWord)}
        <strong>{wordToTest}</strong>
        {sentence.slice(idxOfWord + wordToTest.length)}
      </div>
   );
});

export default Question;