'use client';

import { Row } from "react-bootstrap";

export default function GEPTitle({ slug }) {

   let word;
   switch (slug) {
      case "set1":
         word = "Set 1";
         break;
      case "set2":
         word = "Set 2";
         break;
      case "set3":
         word = "Set 3";
         break;
      case "set4":
         word = "Set 4";
         break;
      case "set5":
         word = "Set 5";
         break;
      case "set6":
         word = "Set 6";
         break;
      case "complete":
         word = "All Questions";
         break;
      default:
         word = "ERROR";
         break;
   };

   return (
      <Row className="my-3">
         <h3 className="text-center m-0">
            GEP English Vocabulary MCQ: <strong>{word}</strong>
         </h3>
      </Row>
   );
}
