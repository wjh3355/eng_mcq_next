'use client';

import { Col } from "react-bootstrap";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import styles from "@/styles/option-buttons.module.css";

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";
import { QnObjType } from "@/lib/types";

export default function RightColumn() {

   const { 
      qnObj,
      handleOptionClick 
   } = useGEP_VOCAB_QnContext() as {qnObj: QnObjType, handleOptionClick: (isCorrect: boolean) => void};
   const { options, correctAns } = qnObj;

   const [randomisedOptions, setRandomisedOptions] = useState<string[]>([]);
   const [selectedOption, setSelectedOption] = useState<null | string>(null);

   useEffect(() => {
      setRandomisedOptions(shuffle(options));
      setSelectedOption(null);
   }, [options]);

   const isDisabled = selectedOption !== null; // disable all buttons once one is clicked

   function renderButton(thisOption: string) {
      let isCorrectOption = (thisOption === correctAns); 
      return (
         <OptionButton
            key={thisOption}
            thisOption={thisOption} // word shown in button
            isCorrectOption={isCorrectOption} 
            hasBeenSelected={thisOption === selectedOption} // all false initially, true for clicked button
            isDisabled={isDisabled} // changes from all false to all true once smth is selected
            onClick={() => {
               setSelectedOption(thisOption);
               handleOptionClick(isCorrectOption);
            }}
         />
      )
   };

   return (
      <Col lg={4} md={5} className="my-2 mt-md-0">
         <div className="vstack gap-3">
            {randomisedOptions.map(renderButton)}
         </div>
      </Col>
   );
};

function OptionButton({
   thisOption,
   isCorrectOption,
   hasBeenSelected,
   onClick,
   isDisabled,
}: {
   thisOption: string,
   isCorrectOption: boolean,
   hasBeenSelected: boolean,
   onClick: () => void,
   isDisabled: boolean
}) {

   const [isHovering, setIsHovering] = useState(false);

   return (
      <button
         onClick={onClick}
         onMouseEnter={() => setIsHovering(true)}
         onMouseLeave={() => setIsHovering(false)}
         disabled={isDisabled}
         className={clsx(
            styles.default, 
            {
               [styles.hover]: isHovering && !hasBeenSelected,
               [styles.correctAns]: isDisabled && isCorrectOption,
               [styles.wrongAns]: hasBeenSelected && !isCorrectOption,
            }
         )}
      >
         <span>{thisOption}</span>
      </button>
   );
};