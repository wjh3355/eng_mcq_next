"use client";

import Button from "react-bootstrap/Button";
import { useClozeContext } from './ClozeProvider';

export default function ClozeStatusUI() {

   const {
      isClozeSubmitted,
      submitCloze,
      resetCloze,
      score,
      triesLeft,
      clozeState
   } = useClozeContext();

   return (
      <div className="d-flex justify-content-center flex-column mt-3">
         {isClozeSubmitted
            ?  <>
                  <p className="fs-5 border border-4 rounded-4 p-3 border-warning fw-bold mx-auto">
                     Your Score: {score} / 15
                  </p>
                  <Button
                     size="sm"
                     variant="warning" 
                     className="mx-auto"
                     onClick={() => resetCloze()}
                  >
                     Reset Cloze
                  </Button>
               </>
            :  <Button
                  size="lg"
                  variant="danger"
                  className="px-5 fw-bold mx-auto"
                  onClick={() => submitCloze(clozeState, triesLeft)}
               >
                  Submit Cloze ({triesLeft} tries left)
               </Button>
         }
      </div>
   );
}