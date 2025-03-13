"use client";

import Col from "react-bootstrap/esm/Col";
import { ClozeBlankState } from "./MTClientComponent";
import styled from "styled-components";

export function MTCloze({
   clozePassageArray,
   clozeState,
   handlePreviousClick,
   handleClozeInputUpdate,
   handleResetCloze,
   hasBeenSubmitted,
}: {
   clozePassageArray: string[];
   clozeState: ClozeBlankState[];
   handlePreviousClick: () => void;
   handleClozeInputUpdate: (e: React.ChangeEvent<HTMLInputElement>) => void;
   handleResetCloze: () => void;
   hasBeenSubmitted: boolean;
}) {

   // get the paragraph to render
   const paragraphToRender: (string | React.JSX.Element)[][] = (() => {

      // 0 to 14 (all 15 blanks)
      let blankCountr = 0;

      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currArray: (string | React.JSX.Element)[] = [];

      for (let fragment of clozePassageArray) {

         // if the fragment is "||", push the current array 
         // to the formattedParagraphs array (denotes a new paragraph)
         // new paragraph: current array is an empty array
         if (fragment === "||") {

            formattedParagraphs.push(currArray);
            currArray = [];

         // if the fragment is "BLANK", add an input field to current array
         // increment the blankCountr
         } else if (fragment === "BLANK") {

            const { mockTestQnNum, answer, status } = clozeState[blankCountr];

            currArray.push(
               <label key={blankCountr}>
                  <strong>(Q{mockTestQnNum})</strong>&nbsp;
                  <MTClozeInput
                     disabled={status === "correct" || status === "incorrect"}
                     $status={status}
                     autoFocus={blankCountr === 0}
                     autoComplete="off"
                     type="text"
                     name={blankCountr.toString()}
                     value={answer}
                     onChange={handleClozeInputUpdate}
                  />
               </label>
            );

            blankCountr++;

         } else {

            currArray.push(fragment);
            
         }
      }
      
      formattedParagraphs.push(currArray);

      return formattedParagraphs;

   })();

   return (
      <>
         <Col xs={12}>
            <article style={{lineHeight: "40px", textAlign: "justify"}}>
               {paragraphToRender.map((paraArr, idx) => 
                  <p key={idx}>{paraArr}</p>)
               }
            </article>
         </Col>
         <Col>
            <button onClick={handleResetCloze} disabled={hasBeenSubmitted} >Reset</button>
            <button onClick={handlePreviousClick}>Previous</button>
            <button disabled>Next</button>
         </Col>
      </>
   );
}

const MTClozeInput = styled.input<{
   $status: "correct" | "incorrect" | "not done" | "done";
}>`
   width: 130px;
   height: 32px;
   text-align: center;
   border: 2px solid;

   border-color: ${({$status}) => $status === "correct" ? "green" : ($status === "incorrect" ? "rgb(190, 44, 44)" : "lightGray")};
   color: ${({$status}) => $status === "correct" ? "green" : ($status === "incorrect" ? "rgb(190, 44, 44)" : "default")};
   font-weight: ${({$status}) => $status === "correct" || $status === "incorrect" ? "bold" : "default"};
`;