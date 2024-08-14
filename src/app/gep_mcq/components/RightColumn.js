'use client';

import { Col } from "react-bootstrap";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import styles from "../../styles/option-buttons.module.css";

import { useGEPQnContext } from "../provider/GEPQnProvider";

export default function RightColumn() {

   const { 
      qnObj: { options, correctAns }, 
      handleOptionClick 
   } = useGEPQnContext();

   const [randomisedOptions, setRandomisedOptions] = useState([]);
   const [selectedOption, setSelectedOption] = useState(null);

   useEffect(() => {
      setRandomisedOptions(shuffle(options));
      setSelectedOption(null);
   }, [options]);

   const isDisabled = selectedOption !== null; // disable all buttons once one is clicked

   function renderButton(thisOption) {
      let isCorrectOption = (thisOption === correctAns); 
      return (
         <OptionButton
            key={thisOption}
            thisOption={thisOption} // word shown in button
            isCorrectOption={isCorrectOption} 
            hasBeenSelected={thisOption === selectedOption} // all false initially, true for clicked button
            isDisabled={isDisabled} // changes from all false to all true once smth is selected
            handleOptionClick={() => {
               setSelectedOption(thisOption);
               handleOptionClick(isCorrectOption);
            }}
         />
      )
   };

   return (
      <Col lg={4} className="my-2 mt-lg-0">
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
   handleOptionClick,
   isDisabled,
}) {

   const [isHovering, setIsHovering] = useState(false);

   return (
      <button
         onClick={handleOptionClick}
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