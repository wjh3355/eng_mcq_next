'use client';

import { Container, Row } from "react-bootstrap";

import GEP_VOCAB_AppTitle from "./components/GEP_VOCAB_AppTitle";
import LeftColumn from "@/app/gep_vocab/components/LeftColumn";
import RightColumn from "@/app/gep_vocab/components/RightColumn";
import AnswerIndicator from "@/app/gep_vocab/components/AnswerIndicator";

import { GEP_VOCAB_QnProvider } from "@/app/gep_vocab/provider/GEP_VOCAB_QnProvider";

export default function GEP_VOCAB_App({ slug }: { slug: string }) {

   return (
      <GEP_VOCAB_QnProvider slug={slug}>
         <Container>
            <GEP_VOCAB_AppTitle />
            <Row>
               <LeftColumn />
               <RightColumn />
            </Row>
         </Container>
         <AnswerIndicator />
      </GEP_VOCAB_QnProvider>
   );
}
