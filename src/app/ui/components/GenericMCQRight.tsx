"use client";

import Col from "react-bootstrap/Col";

import shuffle from "lodash/shuffle";
import { useEffect, useState } from "react";

import { MCQContextValue } from "@/types";

import MCQOption from "./MCQOption";
import Skeleton from "react-loading-skeleton";

import { CircleCheck, CircleX } from 'lucide-react';

export default function GenericMCQRight({
   QnContextToUse
}: {
   QnContextToUse: () => MCQContextValue
}) {

   const {
      isLoading,
      qnObj: { options, correctAns }, 
      handleOptionClick,
      hasReachedEnd
   } = QnContextToUse();

   const [randomisedOptions, setRandomisedOptions] = useState<string[]>([]);
   const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
   const [selectedOption, setSelectedOption] = useState<null | string>(null);

   useEffect(() => {
      if (options.length !== 0) {
         setRandomisedOptions(shuffle(options));
      }

      return () => {
         setRandomisedOptions([]);
         setIsAllDisabled(false);
         setSelectedOption(null);
      }
   }, [options]);

   function OptionsArr() { 

      return randomisedOptions.map((thisOption, idx) => {

         const isThisCorrectOption = thisOption === correctAns;
         const isThisSelected = thisOption === selectedOption;

         const isRed = isAllDisabled && isThisSelected && !isThisCorrectOption;
         const isGreen = isAllDisabled && isThisCorrectOption;
         const isBolded = isAllDisabled && (isThisCorrectOption || isThisSelected);

         return <MCQOption
               key={idx}
               disabled={isAllDisabled}
               onClick={async () => {
                  setSelectedOption(thisOption);
                  setIsAllDisabled(true);
                  await handleOptionClick(isThisCorrectOption);
               }}
               $isRed={isRed}
               $isGreen={isGreen}
               $isBolded={isBolded}

            >
               {thisOption}
               { isGreen && <CircleCheck 
                     size={22} 
                     strokeWidth={3}
                     style={{position: "absolute", right: "3%"}}
                  /> }
               { isRed && <CircleX 
                     size={22} 
                     strokeWidth={3}
                     style={{position: "absolute", right: "3%"}}
                  /> }
         </MCQOption>
      
      });

   }

   if (hasReachedEnd) return null;

   return (
      <Col lg={4} md={5}>
         <div className="vstack gap-3">
            {isLoading
               ? <><Skeleton height={47} /><Skeleton height={47} /><Skeleton height={47} /><Skeleton height={47} /></>
               : <OptionsArr/>
            }
         </div>
      </Col>
   );
};