'use client';

import { Col } from "react-bootstrap";
import { shuffle } from "lodash";
import React, { useEffect, useState } from "react";

import OptionButton from "./OptionButton";

import { useGEPQnContext } from "../utils/GEPQnProvider";

export default function RightColumn() {

   let { qnObj: { options, correctAns }, handleOptionClick } = useGEPQnContext();

   const [randomisedOptions, setRandomisedOptions] = useState([]);
   const [selectedOption, setSelectedOption] = useState(null);

   useEffect(() => {
      setRandomisedOptions(shuffle([...options]));
      setSelectedOption(null);

   }, [options]);

   const isDisabled = selectedOption !== null; // disable all buttons once one is clicked

   function renderButton(thisOption) {
      let isCorrectOption = (thisOption === correctAns); // constant! true for correct button, false for all others
      return (
         <OptionButton
            key={thisOption}
            thisOption={thisOption} // constant! word shown in button
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
      <Col lg={4} className="mt-2 mt-lg-0">
         <div className="vstack gap-3">
            {randomisedOptions.map(renderButton)}
         </div>
      </Col>
   );
}