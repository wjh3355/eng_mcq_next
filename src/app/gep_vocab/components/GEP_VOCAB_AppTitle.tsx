'use client';

import { Row } from "react-bootstrap";

import { useGEP_VOCAB_QnContext } from "../provider/GEP_VOCAB_QnProvider";

export default function GEP_VOCAB_AppTitle() {

   const { qnSet } = useGEP_VOCAB_QnContext();

   return (
      <Row className="my-3">
         <h4 className="text-center m-0">
            GEP English Vocabulary MCQ: <strong>{qnSet}</strong>
         </h4>
      </Row>
   );
}
