'use client';

import { Col } from "react-bootstrap";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";

import { GenericMCQContextValueType, QnObjType } from "@/lib/types";

import OptionButton from "@/app/ui/utils/OptionButton";

export default function GenericRightColumn({
   QnContextToUse
}: {
   QnContextToUse: () => GenericMCQContextValueType
}) {

   const { 
      qnObj,
      handleOptionClick
   } = QnContextToUse();
   const { options, correctAns } = qnObj as QnObjType;

   const [randomisedOptions, setRandomisedOptions] = useState<string[]>([]);
   const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
   const [selectedOption, setSelectedOption] = useState<null | string>(null);

   useEffect(() => {
      setRandomisedOptions(shuffle(options));
      setIsAllDisabled(false);
      setSelectedOption(null);
   }, [options]);

   function renderButtonForThisOption(thisOption: string) {
      let isCorrectOption = (thisOption === correctAns);
      let isSelected = (thisOption === selectedOption);

      return (
         <OptionButton
            key={thisOption}
            thisOption={thisOption}

            isCorrectOption={isCorrectOption} 
            isDisabled={isAllDisabled}
            isSelected={isSelected}
            onSelectAction={() => {
               setSelectedOption(thisOption);
               setIsAllDisabled(true);
               handleOptionClick(isCorrectOption);
            }}
         />
      );

   };

   return (
      <Col lg={4} md={5} className="mt-2 mt-md-0">
         <div className="vstack gap-3">
            {randomisedOptions.map(renderButtonForThisOption)}
         </div>
      </Col>
   );
};