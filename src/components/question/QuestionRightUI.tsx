"use client";

import { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/esm/Button";
import Skeleton from "react-loading-skeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import styled from "styled-components";
import { Search } from "lucide-react";
import shuffle from "lodash/shuffle";
import { zodResolver } from "@hookform/resolvers/zod";

import MCQOption from "../old/MCQOption";
import { useQuestionContext } from "./QuestionProvider";

type SentenceFormFields = { correctedWord: string }

function MCQOptionsComponent() {

   const {
      isLoading,
      qnObj: { options, correctAns },
      setInfo: { hasReachedEnd },
      callbacks: { handleAttempt }
   } = useQuestionContext();

   const [randomisedOptions, setRandomisedOptions] = useState<string[]>([]);
   const [isAllDisabled, setIsAllDisabled] = useState<boolean>(false);
   const [selectedOption, setSelectedOption] = useState<null | string>(null);

   useEffect(() => {
      if (!isLoading && options && options.length !== 0) {
         // shuffle the options if they are not empty 
         // (kindOfQn is meaning, blank or definition)
         setRandomisedOptions(shuffle(options));
      };
   }, [options, isLoading]);

   // if the end of the quiz has been reached, return null
   if (hasReachedEnd) return null;

   return (
      <div className="vstack gap-3">
         {
            randomisedOptions.map((thisOption, idx) => {

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

               return (
                  <MCQOption
                     key={idx}
                     disabled={isAllDisabled}
                     onClick={async () => {
                        setSelectedOption(thisOption);
                        setIsAllDisabled(true);
                        handleAttempt(isThisCorrectOption);
                     }}
                     $isRed={isRed}
                     $isGreen={isGreen}
                     $isBolded={isBolded}
                  >
                     {thisOption}
                  </MCQOption>
               );

            })
         }
      </div>
   );
};

function SpellingInputComponent() {

   const {
      qnObj: { correctAns },
      isLoading,
      userInfo: { isCorrect },
      callbacks: { handleAttempt }
   } = useQuestionContext();

   const { 
      register,
      handleSubmit,
      reset,
      setFocus,
      formState: { isValid }
   } = useForm<SentenceFormFields>({
      resolver: zodResolver(z.object({ correctedWord: z.string().nonempty() })),
      defaultValues: { correctedWord: "" },
   });

   useEffect(() => {
      if (!isLoading) {
         setFocus("correctedWord");
         reset();
      }
   }, [setFocus, isLoading]);

   return (
      <form 
         onSubmit={handleSubmit(data => {
            const isCorrect = data.correctedWord.trim() === correctAns;
            handleAttempt(isCorrect);
         })}
         className="border-0 shadow rounded-2 p-3"
      >
         <label className="text-center">
            The bolded word should be:
            <SpellingInput 
               {...register("correctedWord")}
               type="text"
               disabled={isLoading || isCorrect !== null}
               autoComplete="off"
               $isCorrect={isCorrect}
            />
         </label>

         <Button
            className="d-flex align-items-center justify-content-center mx-auto mt-2 w-50"
            variant="secondary"
            type="submit"
            disabled={!isValid || isCorrect !== null}
         >
            Check<Search size={22} strokeWidth={2} className="ms-1"/>
         </Button>

      </form>
   );
};

export default function QuestionRightUI() {
   
   const {
      qnObj: { kindOfQn },
      setInfo: { hasReachedEnd },
      isLoading
   } = useQuestionContext();

   if (hasReachedEnd) return null;

   return (
      <Col lg={4} md={5}>
         {isLoading 
            ?  <Skeleton height="75px" />
            :  kindOfQn === "spelling"
               ?  <SpellingInputComponent/>
               :  <MCQOptionsComponent/>
         }
      </Col>
   );
};

const SpellingInput = styled.input<{
   $isCorrect: boolean | null;
}>`
   width: 250px;
   height: 40px;
   text-align: center;
   border: 2px solid lightgray;
   border-radius: 5px;
   background-color: white;
   font-size: 18px;
   &:disabled {
      ${({$isCorrect}) => $isCorrect === true && "color: green; font-weight: bold; border-color: green;"}
      ${({$isCorrect}) => $isCorrect === false && "color: rgb(190, 44, 44); font-weight: bold; border-color: rgb(190, 44, 44);"}
   }
`;