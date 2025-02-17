"use client";

import { SpellingContextValue } from "@/definitions";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Skeleton from "react-loading-skeleton";
import styled, { keyframes } from "styled-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeInfo, BookText, CircleArrowRight, Search } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import Spinner from "react-bootstrap/esm/Spinner";
import toast from "react-hot-toast";

type SentenceFormFields = { correctedWord: string }

export default function GenericSpelling({ QnContextToUse }: { QnContextToUse: () => SpellingContextValue }) {

   const {
      qnObj,
      isLoading,
      isCorrect,
      hasReachedEnd,
      currNum,
      handleAttempt,
      handleNextQnBtnClick,
      userPoints,
      wrongAnsArr
   } = QnContextToUse();

   const { sentence, correctAns, type, exp } = qnObj;

   const [isReviewShown, setIsReviewShown] = useState(false);
   const [isExplShown, setIsExplShown] = useState(false);
   const [numAttempts, setNumAttempts] = useState(0);
   const [isCheckBtnCooldown, setIsCheckBtnCooldown] = useState(false);

   const { 
      register,
      handleSubmit,
      reset,
      setFocus,
      formState: { isValid }
   } = useForm<SentenceFormFields>({
      resolver: zodResolver(z.object({ correctedWord: z.string().nonempty() })),
      defaultValues: { correctedWord: "" },
   })

   useEffect(() => {
      if (!isLoading) {
         setFocus("correctedWord");
         setNumAttempts(0);
      }
   }, [setFocus, isLoading]);

   if (hasReachedEnd) return null;

   function ScoreComponent() {
      return (
         <div className="border border-2 border-warning rounded-2 px-2 py-1 fw-bold">
            {Number.isNaN(userPoints) 
               ?  <Spinner animation="border" size="sm" className="mx-4" variant="secondary"/> 
               :  <span>Points: {userPoints}</span>
            }
         </div>
      );
   }

   function handler(data: SentenceFormFields) {
      const isCorrect = data.correctedWord.trim() === correctAns;
      if (!isCorrect && numAttempts === 0) {
         // first wrong attempt: 
         // show toast and set numAttempts to 1
         // create 3 second cooldown for check button
         toast.error("Sorry, that was incorrect. You have one more attempt. \n\nNote that the answer is case-sensitive.");
         setNumAttempts(1);

         setIsCheckBtnCooldown(true);
         setTimeout(() => setIsCheckBtnCooldown(false), 3000);

         return;
      }
      handleAttempt(isCorrect);
   }

   return (
      <>
         <Col lg={8} md={7}>
            <Card body className="mb-3 shadow border-0">
               {isLoading 
                  ?  <Skeleton height="24px" />
                  :  <TypingAnim
                        sentence={sentence}
                        num={currNum}
                     />
               }
            </Card>
            <section className="hstack gap-3 mb-3">
               <ScoreComponent/>

               <button 
                  className="border-0 bg-transparent p-0 ms-auto"
                  disabled={isCorrect === null}
                  onClick={() => setIsExplShown(!isExplShown)}
               >
                  <BadgeInfo size={25} strokeWidth={2}/>
               </button>

               <button 
                  className="border-0 bg-transparent p-0"
                  disabled={wrongAnsArr.length === 0}
                  onClick={() => setIsReviewShown(!isReviewShown)}
               >
                  <BookText size={25} strokeWidth={2}/>
               </button>

            </section>
         </Col>

         <Col lg={4} md={5}>
            <form 
               onSubmit={handleSubmit(handler)}
               onKeyDown={(e) => {
                  if (e.key === "Enter") e.preventDefault();
               }}
               className="border-0 shadow rounded-2 p-3"
            >
               <label className="text-center">
                  The underlined word should be:
                  <SpellingInput 
                     {...register("correctedWord")}
                     type="text"
                     disabled={isLoading || isCorrect !== null}
                     autoComplete="off"
                     $isCorrect={isCorrect}
                  />
               </label>

               <div className="hstack gap-2 mt-2">
                  <Button
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           e.preventDefault();
                           e.currentTarget.click();
                           // the button can be clicked using "enter"
                           // but not the input field
                           // more user friendly for keyboard users
                        }
                     }}
                     className="d-flex align-items-center justify-content-center w-50"
                     variant="secondary"
                     type="submit"
                     disabled={!isValid || isCorrect !== null || isCheckBtnCooldown}
                  >
                     Check<Search size={22} strokeWidth={2} className="ms-1"/>
                  </Button>
                  <Button
                     onKeyDown={(e) => {
                        if (e.key === "Enter") {
                           e.preventDefault();
                           e.currentTarget.click();
                           // the button can be clicked using "enter"
                        }
                     }}
                     disabled={isCorrect === null}
                     className="d-flex align-items-center justify-content-center w-50"
                     onClick={() => {
                        reset();
                        handleNextQnBtnClick();
                     }}
                  >
                     <strong>Next</strong><CircleArrowRight size={22} strokeWidth={2} className="ms-1"/>
                  </Button>
               </div>

            </form>
         </Col>

         <Modal size="lg" centered show={isExplShown} onHide={() => setIsExplShown(!isExplShown)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">{correctAns}</Modal.Title></Modal.Header>
            <Modal.Body>
               {exp}
            </Modal.Body>
         </Modal>

         <Modal size="lg" centered show={isReviewShown} onHide={() => setIsReviewShown(!isReviewShown)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Review Incorrect Questions</Modal.Title></Modal.Header>
            <Modal.Body>
               {wrongAnsArr.map(spl => <p key={spl.qnNum}>{spl.exp}{" "}({spl.type})</p>)}
            </Modal.Body>
         </Modal>
      </>
   );
}

function TypingAnim({ 
   sentence,
   num
}: { 
   sentence: string,
   num: number
}){

   const match = sentence.match(/\[([^\[\]]+)\]/);
   const misspelledWord = match ? match[1] : "";

   const [before, after] = sentence.split(/\[[^\[\]]+\]/);

   return (
      <TypingAnimContainer>
         {`Q${num}. `}

         {before.split('').map((char, idx) => 
            <TypingAnimChar key={`before-${idx}`} $index={idx} $isPartOfMisspelled={false} >
               {char}
            </TypingAnimChar>
         )}

         {misspelledWord.split('').map((char, idx) =>
            <TypingAnimChar key={`misspelled-${idx}`} $index={before.length + idx} $isPartOfMisspelled={true}>
               {char}
            </TypingAnimChar>
         )}

         {after.split('').map((char, idx) => 
            <TypingAnimChar key={`after-${idx}`} $index={before.length + misspelledWord.length + idx} $isPartOfMisspelled={false}>
               {char}
            </TypingAnimChar>
         )}

      </TypingAnimContainer>
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

const TypingAnimContainer = styled.div`
   display: block;
   width: 100%;
   overflow: hidden;
   word-break: break-word;
   font-size: 18px
`;

const TypingAnimChar = styled.span<{
   $index: number;
   $isPartOfMisspelled?: boolean;
}>`
   opacity: 0;
   animation: ${keyframes` from { opacity: 0 } to { opacity: 1 } `} 10ms linear forwards;
   animation-delay: ${({$index}) => $index * 12 }ms;
   text-decoration: ${({$isPartOfMisspelled}) => $isPartOfMisspelled ? "underline" : "none"};
   font-weight: ${({$isPartOfMisspelled}) => $isPartOfMisspelled ? "bold" : "default"};
`;