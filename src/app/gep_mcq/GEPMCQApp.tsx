'use client';

import { Container, Row } from "react-bootstrap";

import GEPTitle from "@/app/gep_mcq/components/GEPTitle";
import LeftColumn from "@/app/gep_mcq/components/LeftColumn";
import RightColumn from "@/app/gep_mcq/components/RightColumn";
import AnswerIndicator from "@/app/gep_mcq/components/AnswerIndicator";

import { GEPQnProvider } from "@/app/gep_mcq/provider/GEPQnProvider";

export default function GEPMCQApp({ slug }: { slug: string }) {

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
