"use client";

import React from "react";

import { Cloze, Collections, Question, UserProfileDocument } from "@/definitions";

import Row from "react-bootstrap/esm/Row";

import MTQuestion from "./MTQuestion";
import MTCloze from "./MTCloze";
import MockTestProvider from "./MTProvider";
import MTPagination from "./MTPagination";

export default function MTClientComponent({
   questions,
   cloze,
   user,
   MTnum
}: {
   questions: Partial<Record<Collections, Question[]>>;
   cloze: Cloze;
   user: UserProfileDocument;
   MTnum: number;
}) {

   return (
      <section style={{fontSize: "17px"}}>
         <MockTestProvider
            questions={questions}
            cloze={cloze}
            user={user}
            MTnum={MTnum}
         >
            <Row className="mb-3">
               <MTQuestion/>
               <MTCloze/>
            </Row>
            <MTPagination/>
         </MockTestProvider>
      </section>
   );
}