'use client';

import { Row } from "react-bootstrap";

import { useGEPQnContext } from "../provider/GEPQnProvider";

export default function GEPTitle() {

   const { qnSet } = useGEPQnContext();

   return (
      <Row className="my-3">
         <h4 className="text-center m-0">
            GEP English Vocabulary MCQ: <strong>{qnSet}</strong>
         </h4>
      </Row>
   );
}
