'use client';

import { Container, Row } from "react-bootstrap";

import GEPTitle from "@/app/ui/GEPTitle";
import LeftColumn from "@/app/ui/LeftColumn";
import RightColumn from "@/app/ui/RightColumn";
import AnswerIndicator from "@/app/ui/AnswerIndicator";

import { GEPQnProvider } from "@/app/utils/GEPQnProvider";

export default function GEPMCQApp({ slug }) {

   return (
      <GEPQnProvider slug={slug}>
         <Container>
            <GEPTitle />
            <Row>
               <LeftColumn />
               <RightColumn />
            </Row>
         </Container>
         <AnswerIndicator />
      </GEPQnProvider>
   );
}
