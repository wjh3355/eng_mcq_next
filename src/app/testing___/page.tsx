"use client";

import React, { useMemo, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

type FormData = Record<number, {
   value: string,
   correctAnswers: string[],
   isCorrect: boolean | null
}>;

const paragraph = `For the elderly in Singapore, Covid-19 has caused them to be detached from their normal lives. As they are a vulnerable group, the circuit breaker {rules} were particularly strict. Frequently visited public spaces {like} community clubs, markets and hawker centres were shut. Their leisure options at home are {limited} to watching the television and listening to the radio, or chatting with their friends on the phone.||The Senior Go Digital training programme was launched to help the elderly {cope} with the challenge. The digital training {consists} of communication skills like video calls, connecting to WiFi, and basic cyber security tips. The workshops are run on in environments the elderly are {familiar} with such as community clubs and libraries. They are supported by volunteers who work as digital ambassadors to {teach} the elderly one-on-one or in small groups. The elderly often feel assured {as} it was safe and conducive.||Madam Farah is a 60-year-old full-time homemaker. Although she only picked up basic computer skills recently, juggling household chores {with/and} social media platforms such as Zoom and Instagram has {become} second nature. She admits that seniors like herself may often feel reluctant to step out of their {comfort} zone. However, she embraced the challenge as she was {motivated} by curiosity and a desire to learn more. She was also encouraged by the government's efforts to support {senior} citizens like her.||Madam Farah uses Instagram {frequently} to update her posts for her followers and volunteers at the community club, who look forward to her updates everyday. They were unable to meet during the circuit breaker, but social media {helped} them remain connected on a digital level. Digital technology is indeed empowering.`;


export default function Page() {

   const wordsToTestArr: string[][] = useMemo(() => 
      paragraph.match(/\{[^}]*\}/g)!.map((match) => 
         [...match.slice(1, -1).split("/").filter((word) => word !== "")])
      , []
   );

   const textArr = useMemo(() => paragraph.split(/\{[^}]*\}/g), []);

   const initialFormData: FormData = useMemo(() => Object.fromEntries(
      Array.from(
         { length: wordsToTestArr.length }, 
         (_, i) => [
            i, 
            { 
               value: "", 
               isCorrect: null, 
               correctAnswers: wordsToTestArr[i] 
            }
         ]
      )
   ), [wordsToTestArr]);

   ///////////
   
   const [formData, setFormData] = useState<FormData>(initialFormData);
   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

   ///////////

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const newData = { ...formData };

      Object.entries(formData).forEach(([idx, { value, correctAnswers }]) => {
         const trimmedValue = value.trim();
         const i = Number(idx);
         newData[i].isCorrect = correctAnswers.includes(trimmedValue);
         newData[i].value = trimmedValue;
      });
      
      setFormData(newData);
      setIsSubmitted(true);
   };

   function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      const i = Number(name);
      setFormData(prv => ({
         ...prv,
         [i]: { ...prv[i], value }
      }))
   };

   function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Enter') event.preventDefault();
   };

   function renderParagraph(): (string | React.JSX.Element)[][] {
      const paragraphsWithInput = textArr.reduce<(string | React.JSX.Element)[]>(
         (acc, part, idx) => {
   
            const splitPart = part.split(/(\|\|)/);
   
            if (idx === textArr.length - 1) {
               return [...acc, ...splitPart];
            } 
   
            let inputTextClass = "border border-2 ";
            let { value, isCorrect } = formData[idx];
            if (isCorrect === true) {
               inputTextClass += "border-success text-success fw-bold";
            } else if (isCorrect === false) {
               inputTextClass += "border-danger text-danger fw-bold";
            }
   
            return [
               ...acc,
               ...splitPart,
               <React.Fragment key={idx}>
                  <strong>({idx + 1})</strong>&nbsp;
                  <input
                     autoFocus={idx === 0}
                     style={{
                        width: "150px",
                        height: "32px",
                        textAlign: "center",
                     }}
                     className={inputTextClass}
                     disabled={isCorrect !== null}
                     type="text"
                     name={idx.toString()}
                     value={value}
                     onChange={handleInputChange}
                     onKeyDown={handleKeyDown}
                  />
               </React.Fragment>,
            ]; 
         }, []
      );
   
      let formattedParagraphs: (string | React.JSX.Element)[][] = [];
      let currentArray: (string | React.JSX.Element)[] = [];
      for (let item of paragraphsWithInput) {
         if (item === "||") {
            formattedParagraphs.push(currentArray);
            currentArray = [];
         } else {
            currentArray.push(item);
         }
      }
      if (currentArray.length > 0) formattedParagraphs.push(currentArray);

      return formattedParagraphs;
   }


   return (
      <Container className="mb-5">
         <Row className="my-3">
            <h5 className="text-center m-0">Vocabulary Cloze</h5>
         </Row>
         <form onSubmit={handleSubmit} style={{lineHeight: "45px", fontSize: "18px"}}>

            {
               renderParagraph().map((para, idx) => 
                  <p key={idx}>{para}</p>
               )
            }
            <div className="hstack gap-3 d-flex justify-content-center">
               <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitted}
               >
                  Submit
               </Button>
               <Button 
                  onClick={() => setFormData(initialFormData)}
                  size="lg"
                  variant="warning"
                  disabled={isSubmitted}
               >
                  Reset
               </Button>
            </div>
         </form>

         {
            isSubmitted && <div className="d-flex justify-content-center mt-3">
               <span className="border border-2 p-2 rounded border-info">
                  Score:
                  &nbsp;
                  {
                     Object
                        .values(formData)
                        .map(dat => dat.isCorrect)
                        .filter(stat => stat === true)
                        .length
                  }
                  &nbsp;/&nbsp;
                  {Object.keys(formData).length}
               </span>
            </div>
         }
         {
            isSubmitted &&
            <div>
               Answers:
               {
                  Object.values(formData).map(({ correctAnswers }, idx) => 
                     <div key={idx}>
                        {Number(idx)+1})&nbsp;{correctAnswers.join(" / ")}
                     </div>
                  )
               }
            </div>
         }
      </Container>
   );
}