'use client';

import { Col } from "react-bootstrap";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";
import { QnObjType } from "@/lib/types";

import OptionButton from "@/app/ui/utils/OptionButton";

export default function RightColumn() {

   const { 
      qnObj,
      handleOptionClick
   } = useGEP_VOCAB_QnContext() as {qnObj: QnObjType, handleOptionClick: (isCorrect: boolean) => void};
   const { options, correctAns } = qnObj;

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
      <Col lg={4} md={5} className="my-2 mt-md-0">
         <div className="vstack gap-3">
            {randomisedOptions.map(renderButtonForThisOption)}
         </div>
      </Col>
   );
};