'use client';

import { Card } from "react-bootstrap";

import { useGEPQnContext } from "../utils/GEPQnProvider";

export default function Explanation() {

   const { qnObj: { rootWord, type, def } } = useGEPQnContext();
   
   return (
      <Card body>
         <p>
            <strong className="fs-5 me-1">
               {rootWord}&nbsp;
            </strong>
            <span className="fst-italic">({type})</span>
         </p>
         {def}.
      </Card>
   );
}