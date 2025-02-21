"use client";

import Col from "react-bootstrap/Col";

import shuffle from "lodash/shuffle";
import { useEffect, useState } from "react";

import { MCQContextValue } from '@/definitions';

import MCQOption from "./MCQOption";
import Skeleton from "react-loading-skeleton";

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
         // shuffle the options if they are not empty
         setRandomisedOptions(shuffle(options));
      }

      return () => {
         // reset the options when the component unmounts
         setRandomisedOptions([]);
         setIsAllDisabled(false);
         setSelectedOption(null);
      }
   }, [options]);

   // if the end of the quiz has been reached, return null
   if (hasReachedEnd) return null;

   function OptionsArr() {

      return randomisedOptions.map((thisOption, idx) => {

         // true if this option is the correct answer
         const isThisCorrectOption = thisOption === correctAns;
         // true if this option has been selected
         const isThisSelected = thisOption === selectedOption;
         // mark option as red when all options are disabled and this option is selected but is not the correct answer
         const isRed = isAllDisabled && isThisSelected && !isThisCorrectOption;
         // mark option as green if all options are disabled and this option is the correct answer (regardless of whether it is selected)
         const isGreen = isAllDisabled && isThisCorrectOption;
         // mark as bolded if all options are disabled and this option is either the correct answer or the selected option
         const isBolded = isAllDisabled && (isThisCorrectOption || isThisSelected);

         return <MCQOption
               key={idx}
               disabled={isAllDisabled}
               onClick={async () => {
                  setSelectedOption(thisOption);
                  setIsAllDisabled(true);
                  handleOptionClick(isThisCorrectOption);
               }}
               $isRed={isRed}
               $isGreen={isGreen}
               $isBolded={isBolded}

            >
               {thisOption}
         </MCQOption>
      
      });

   }

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