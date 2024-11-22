"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";

const paragraph = `The Great Wall of China is one of the most famous landmarks in the world. It was built
over two thousand {years} ago to protect China from invaders. The wall
stretches about 21,000 kilometers and goes {through} northern China.
The construction of the wall {took} a long time and involved millions of
workers. It was made from {various/many} materials, including earth, wood, and
stone. In some areas, the wall was built on {steep} hills and mountains,
which made the work even harder. The Great Wall was not a single continuous wall but a
series of {walls} connected together.
Many parts of the Great Wall have {deteriorated} over the centuries due to weather
and erosion. Some sections have been {restored} to preserve them for future
generations. The wall also served as a symbol of China's {strength} and
determination.
Today, the Great Wall is a popular travel destination. Millions of {tourists} visit
each year to see its impressive structure and learn about its history. It is {considered}
one of the greatest architectural achievements in human history.
The wall also {played} a key role in supporting the Silk Road, an ancient trade
route that connected China with other parts of Asia and Europe. Merchants used the route
to {trade} goods such as silk, spices, and precious metals.
In addition to its historical significance, the Great Wall is an {example} of
architectural innovation. Engineers and builders used their skills and knowledge to create
a structure that could withstand the test of time. The Great Wall remains an
{important} reminder of China's rich history and cultural heritage. Efforts to
protect and restore the wall continue, ensuring that future generations can appreciate its
grandeur.`;


export default function Page() {

   const wordsToTestArr: string[][] = paragraph
      .match(/\{[^}]*\}/g)!
      .map(match => [...match
         .slice(1, -1)
         .split("/")]) ?? [];
   
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
   
   const paragraphWithInputs = partsArr.reduce<(string | React.JSX.Element)[]>(
      (acc, part, idx) => {
         if (idx === partsArr.length - 1) {
            return [...acc, part];
         } else {

            let borderClass;
            let inputStatus = formStatus[idx];
            if (inputStatus === null) {
               borderClass = "border"
            } else if (inputStatus === true) {
               borderClass = "border border-success"
            } else if (inputStatus === false) {
               borderClass = "border border-danger"
            }

            return [
               ...acc, 
               part, 
               <input
                  key={idx}
                  style={{width: "100px", height: "28px"}}
                  className={borderClass}
                  disabled={inputStatus === true}
                  type="text"
                  name={idx.toString()}
                  value={formData[idx]}
                  onChange={handleInputChange}
               />
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
         newStatus[i] = correctAnsObj[i]?.includes(input.toLowerCase());
      });
      
      setFormStatus(newStatus);
   };

   function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const { name, value } = event.target;
      setFormData(prv => ({...prv, [name]: value.trim()}))
   }

   return (
      <Container>
         <form onSubmit={handleSubmit} className="lh-lg">
            {paragraphWithInputs}
            <br/>
            <br/>
            <button type="submit">Submit</button>
         </form>
      </Container>
   );
}