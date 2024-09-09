'use client';

import Col from "react-bootstrap/Col";

import shuffle from "lodash/shuffle";
import { useEffect, useState } from "react";

import { GenericMCQContextValueType } from "@/lib/types";

import OptionButton from "./OptionButton";
import Skeleton from "react-loading-skeleton";

export default function GenericRightColumn({
   QnContextToUse
}: {
   QnContextToUse: () => GenericMCQContextValueType
}) {

   const { qnObj: { options, correctAns }, handleOptionClick } = QnContextToUse();

   const [randomisedOptions, setRandomisedOptions] = useState<string[]>([]);
   const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
   const [selectedOption, setSelectedOption] = useState<null | string>(null);

   useEffect(() => {
      if (options.length !== 0) {
         setRandomisedOptions(shuffle(options));
         setIsAllDisabled(false);
         setSelectedOption(null);
      }
   }, [options]);

   function renderButtonForThisOption(thisOption: string) {
      let isThisCorrectOption = (thisOption === correctAns);
      let isThisSelected = (thisOption === selectedOption);

      return (
         <OptionButton
            key={thisOption}

            isCorrectOption={isThisCorrectOption} 
            isSelected={isThisSelected}

            disabled={isAllDisabled}
            onClick={() => {
               setSelectedOption(thisOption);
               setIsAllDisabled(true);
               handleOptionClick(isThisCorrectOption);
            }}
         >
            {thisOption}
         </OptionButton>
      );
   };

   return (
      <Col lg={4} md={5} className="mt-2 mt-md-0">
         <div className="vstack gap-3">
            {
               correctAns
                  ? randomisedOptions.map(renderButtonForThisOption)
                  : <ButtonSkeletons/>
            }
         </div>
      </Col>
   );
};

function ButtonSkeletons() {
   return (
      <>
         <Skeleton height={54}/>
         <Skeleton height={54}/>
         <Skeleton height={54}/>
         <Skeleton height={54}/>
      </>
   )
}