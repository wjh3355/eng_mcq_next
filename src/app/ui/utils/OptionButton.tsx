import clsx from "clsx";
import styles from "@/styles/option-buttons.module.css";

export default function OptionButton({
   thisOption,
   isCorrectOption,
   isDisabled,
   isSelected,
   onSelectAction,
}: {
   thisOption: string,
   isCorrectOption: boolean,
   isDisabled: boolean,
   isSelected: boolean,
   onSelectAction: () => void
}) {

   return (
      <button
         onClick={onSelectAction}
         disabled={isDisabled}
         className={clsx(
            styles.default, 
            {
               [styles.correctAns]: isDisabled && isCorrectOption,
               [styles.wrongAns]: isDisabled && !isCorrectOption && isSelected
            }
         )}
      >
         <span>{thisOption}</span>
      </button>
   );
};