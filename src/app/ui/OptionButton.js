'use client';

import { useState } from "react";
import { clsx } from "clsx";
import styles from "../styles/option-buttons.module.css";

export default function OptionButton({
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
}
