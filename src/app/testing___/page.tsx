"use client";

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

const paragraph = `The Great Wall of China is one of the most famous landmarks in the world. It was built
over two thousand {years} ago to protect China from invaders. The wall
stretches about 21,000 kilometers and goes {through/across/along} northern China.||
The construction of the wall {took/required} a long time and involved millions of
workers. It was made from {various/many/numerous} materials, including earth, wood, and
stone. In some areas, the wall was built on {steep/rugged/treacherous/sloping} hills and mountains,
which made the work even harder. The Great Wall was not a single continuous wall but a
series of {walls/fortifications/structures} connected together.
Many parts of the Great Wall have {deteriorated/eroded/worn/decayed} over the centuries due to weather
and erosion. Some sections have been {restored/rebuilt/repaired/refurbished/reconstructed} to preserve them for future
generations. The wall also served as a symbol of China's {strength/power/fortitude/resilience/might} and
determination.||
Today, the Great Wall is a popular travel destination. Millions of {tourists/travellers/sightseers} visit
each year to see its impressive structure and learn about its history. It is {considered/deemed}
one of the greatest architectural achievements in human history.||
The wall also {played/served} a key role in supporting the Silk Road, an ancient trade
route that connected China with other parts of Asia and Europe. Merchants used the route
to {trade/exchange} goods such as silk, spices, and precious metals.||
In addition to its historical significance, the Great Wall is an {example} of
architectural innovation. Engineers and builders used their skills and knowledge to create
a structure that could withstand the test of time.|| The Great Wall remains an
{important/vital/crucial/significant} reminder of China's rich history and cultural heritage. || Efforts to
protect and restore the wall continue, ensuring that future generations can appreciate its
grandeur.`;


export default function Page() {

   const wordsToTestArr: string[][] = paragraph
      .match(/\{[^}]*\}/g)!
      .map(match => [...match
         .slice(1, -1)
         .split("/")
         .filter(word => word !== "")
      ]) ?? [];
   
   const numWordsToTest = wordsToTestArr.length;

   const correctAnsObj: Record<number, string[]> = Object.fromEntries(
      Array.from({ length: numWordsToTest }, (_, i) => [i, wordsToTestArr[i]])
   );
   
   const textArr = paragraph.split(/\{[^}]*\}/g);

   const formDataAllEmptyInputs = Object.fromEntries(Array.from({ length: numWordsToTest }, (_, i) => [i, ""]));

   ///////////
   
   const [formData, setFormData] = useState<Record<number, string>>(formDataAllEmptyInputs);
   const [formStatus, setFormStatus] = useState<Record<number, boolean | null>>(
      Object.fromEntries(Array.from({ length: numWordsToTest }, (_, i) => [i, null]))
   );
   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

   ///////////

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const newStatus = { ...formStatus };

      Object.entries(formData).forEach(([idx, input]) => {
         const i = Number(idx);
         newStatus[i] = correctAnsObj[i]?.includes(input.trim());
      });
      
      setFormStatus(newStatus);
      setIsSubmitted(true);
   };

   function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      setFormData(prv => ({...prv, [name]: value }))
   }

   function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Enter') event.preventDefault();
   };

   const pWithInputs = textArr.reduce<(string | React.JSX.Element)[]>(
      (acc, part, idx) => {

         const splitPart = part.split(/(\|\|)/);

         if (idx === textArr.length - 1) {
            return [...acc, ...splitPart];
         } 

         let inputTextClass = "border border-2 rounded ";
         let thisInputStatus = formStatus[idx];
         if (thisInputStatus === true) {
            inputTextClass += "border-success text-success fw-bold";
         } else if (thisInputStatus === false) {
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
                     width: "140px",
                     height: "30px",
                     textAlign: "center",
                     position: "relative",
                  }}
                  className={inputTextClass}
                  disabled={thisInputStatus !== null}
                  type="text"
                  name={idx.toString()}
                  value={formData[idx]}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
               />
            </React.Fragment>,
         ]; 
      }, []
   );

   let pWithInputsAndParagraphing: (string | React.JSX.Element)[][] = [];
   let currentArray: (string | React.JSX.Element)[] = [];
   for (let item of pWithInputs) {
      if (item === "||") {
         pWithInputsAndParagraphing.push(currentArray);
         currentArray = [];
      } else {
         currentArray.push(item);
      }
   }
   if (currentArray.length > 0) pWithInputsAndParagraphing.push(currentArray);

   return (
      <Container>
         <form onSubmit={handleSubmit} style={{lineHeight: "40px", fontSize: "18px"}}>

            {
               pWithInputsAndParagraphing.map((stuff, idx) => 
                  <p key={idx}>{stuff}</p>
               )
            }

            <Button 
               type="submit"
               size="lg"
               disabled={isSubmitted}
            >
               Submit
            </Button>

            &ensp;

            <Button 
               onClick={() => setFormData(formDataAllEmptyInputs)}
               size="lg"
               variant="warning"
               disabled={isSubmitted}
            >
               Reset
            </Button>

            &ensp;

            {
               isSubmitted && <span className="border border-2 p-2 rounded border-primary">
                  Score:
                  &nbsp;
                  {Object.values(formStatus).filter(stat => stat === true).length}
                  &nbsp;/&nbsp;
                  {numWordsToTest}
                  </span>
            }

         </form>

         <br/>

         {
            isSubmitted && Object.entries(correctAnsObj).map(([idx, ansArr]) => 
            <div key={idx}>
               {Number(idx)+1})&nbsp;{ansArr.join(" / ")}
            </div>)
         }

         <br/>
         <br/>
      </Container>
   );
}