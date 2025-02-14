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
import { BadgeInfo, BookText, CircleArrowRight, CircleCheck, CircleX } from "lucide-react";
import { useState } from "react";
import Modal from "react-bootstrap/esm/Modal";
import Spinner from "react-bootstrap/esm/Spinner";

type FormField = { correctedWord: string }

export default function GenericSpelling({ QnContextToUse }: {  QnContextToUse: () => SpellingContextValue }) {

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

   const { 
      register,
      handleSubmit,
      reset,
      formState: { isValid }
   } = useForm<FormField>({
      resolver: zodResolver(z.object({ correctedWord: z.string().nonempty() })),
      defaultValues: { correctedWord: "" },
   })

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

   return (
      <>
         <Col lg={8} md={7}>
            <Card body className="mb-3">
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
            <section className="vstack gap-3">

               <div>The misspelled word should be:</div>

               <form 
                  onSubmit={
                     handleSubmit(
                        (data: FormField) => handleAttempt(
                           data.correctedWord.trim().toLowerCase() === correctAns
                        )
                     )
                  }
                  onKeyDown={(e) => {
                     if (e.key === "Enter") e.preventDefault();
                  }}
               >
                  <input 
                     {...register("correctedWord")}
                     type="text"
                     disabled={isLoading || isCorrect !== null}
                     autoFocus={true}
                     autoComplete="off"
                  />

                  {/* { isCorrect === true && 
                     <CircleCheck
                        className="text-success"
                        size={22} 
                        strokeWidth={3}
                     /> 
                  }
                  { isCorrect === false &&
                     <CircleX 
                        className="text-danger"
                        size={22} 
                        strokeWidth={3}
                     /> 
                  } */}

                  <Button
                     variant="danger"
                     type="submit"
                     disabled={!isValid || isCorrect !== null}
                  >
                     Check
                  </Button>
               </form>

               <Button
                  disabled={isCorrect === null}
                  className="d-flex align-items-center justify-content-center"
                  onClick={() => {
                     reset();
                     handleNextQnBtnClick();
                  }}
               >
                  <strong>Next&nbsp;</strong><CircleArrowRight size={22} strokeWidth={2}/>
               </Button>

            </section>
         </Col>

         <Modal size="lg" centered show={isExplShown} onHide={() => setIsExplShown(!isExplShown)}>
            <Modal.Header closeButton><Modal.Title className="fs-5">Definition</Modal.Title></Modal.Header>
            <Modal.Body>
               {exp}{" "}({type})
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

const SpellingInput = styled.input`
   width: 250px;
   height: 35px;
   text-align: center;
   border: 2px solid lightgray;
   border-radius: 5px;
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