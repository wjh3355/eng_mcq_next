"use client";

import React, { useState } from "react";
import Container from "react-bootstrap/Container";

const paragraph = `The Great Wall of China is one of the most famous landmarks in the world. It was built
over two thousand {years} ago to protect China from invaders. The wall
stretches about 21,000 kilometers and goes {through/across/along} northern China.
The construction of the wall {took/required} a long time and involved millions of
workers. It was made from {various/many/numerous} materials, including earth, wood, and
stone. In some areas, the wall was built on {steep/rugged/treacherous/sloping} hills and mountains,
which made the work even harder. The Great Wall was not a single continuous wall but a
series of {walls/fortifications/structures} connected together.
Many parts of the Great Wall have {deteriorated/eroded/worn/decayed} over the centuries due to weather
and erosion. Some sections have been {restored/rebuilt/repaired/refurbished/reconstructed} to preserve them for future
generations. The wall also served as a symbol of China's {strength/power/fortitude/resilience/might} and
determination.
Today, the Great Wall is a popular travel destination. Millions of {tourists/travellers/sightseers} visit
each year to see its impressive structure and learn about its history. It is {considered/deemed}
one of the greatest architectural achievements in human history.
The wall also {played/served} a key role in supporting the Silk Road, an ancient trade
route that connected China with other parts of Asia and Europe. Merchants used the route
to {trade/exchange} goods such as silk, spices, and precious metals.
In addition to its historical significance, the Great Wall is an {example} of
architectural innovation. Engineers and builders used their skills and knowledge to create
a structure that could withstand the test of time. The Great Wall remains an
{important/vital/crucial/significant} reminder of China's rich history and cultural heritage. Efforts to
protect and restore the wall continue, ensuring that future generations can appreciate its
grandeur.`;


export default function Page() {

   const wordsToTestArr: string[][] = paragraph
      .match(/\{[^}]*\}/g)!
      .map(match => [...match
         .slice(1, -1)
         .split("/")
         .filter(word => word !== "")]) ?? [];
   
   const numOfWords = wordsToTestArr.length;

   const correctAnsObj: Record<number, string[]> = Object.fromEntries(
      Array.from({ length: numOfWords }, (_, i) => [i, wordsToTestArr[i]])
   );
   
   const partsArr = paragraph.split(/\{[^}]*\}/g)!;
   
   const [formData, setFormData] = useState<Record<number, string>>(
      Object.fromEntries(Array.from({ length: numOfWords }, (_, i) => [i, ""]))
   );
   const [formStatus, setFormStatus] = useState<Record<number, boolean | null>>(
      Object.fromEntries(Array.from({ length: numOfWords }, (_, i) => [i, null]))
   );
   const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
   
   const paragraphWithInputs = partsArr.reduce<(string | React.JSX.Element)[]>(
      (acc, part, idx) => {
         if (idx === partsArr.length - 1) {
            return [...acc, part];
         } else {

            let inputclass = "border border-2 rounded ";
            let thisInputStatus = formStatus[idx];
            if (thisInputStatus === true) {
               inputclass += "border-success"
            } else if (thisInputStatus === false) {
               inputclass += "border-danger"
            }

            return [
               ...acc, 
               part, 
               <React.Fragment key={idx}>
                  <strong>({idx+1})</strong>&nbsp;
                  <input
                     autoFocus={idx === 0}
                     style={{ width: "140px", height: "32px", textAlign: "center" }}
                     className={inputclass}
                     disabled={thisInputStatus !== null}
                     type="text"
                     name={idx.toString()}
                     value={formData[idx]}
                     onChange={handleInputChange}
                     onKeyDown={handleKeyDown}
                  />
               </React.Fragment>
            ];
         }
      },
      []
   );

   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();

      const newStatus = { ...formStatus };

      Object.entries(formData).forEach(([idx, input]) => {
         const i = Number(idx);
         newStatus[i] = correctAnsObj[i]?.includes(input);
      });
      
      setFormStatus(newStatus);
      setIsSubmitted(true);
   };

   function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      setFormData(prv => ({...prv, [name]: value.trim()}))
   }

   function handleClearAllInputs() {
      setFormData(Object.fromEntries(Array.from({ length: numOfWords }, (_, i) => [i, ""])));
   }

   function handleKeyDown(event: React.KeyboardEvent) {
      if (event.key === 'Enter') {
         event.preventDefault();
      }
   };

   return (
      <Container>
         <form onSubmit={handleSubmit} style={{lineHeight: "40px", fontSize: "18px"}}>
            {paragraphWithInputs}
            <br/>
            <br/>
            <button 
               type="submit"
               disabled={isSubmitted}
            >
               Submit
            </button>
            &ensp;
            <button 
               onClick={() => handleClearAllInputs()}
               disabled={isSubmitted}
            >
               Clear All
            </button>
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