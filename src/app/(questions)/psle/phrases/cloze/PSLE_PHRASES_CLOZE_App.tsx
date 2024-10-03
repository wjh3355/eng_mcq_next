'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import { PSLE_PHRASES_CLOZE_qnSetIntervals } from "@/lib/questionSetIntervals";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider("psle_phrases_cloze", PSLE_PHRASES_CLOZE_qnSetIntervals);
const PSLE_PHRASES_CLOZE_QnProvider = GenericMCQProvider;
const usePSLE_PHRASES_CLOZE_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSetName } = usePSLE_PHRASES_CLOZE_QnContext();

   return (
      <h4 className="text-center m-0">
         PSLE Phrases Cloze: <strong>{qnSetName}</strong>
      </h4>
   );
};

export default function PSLE_CLOZE_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PSLE_PHRASES_CLOZE_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePSLE_PHRASES_CLOZE_QnContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePSLE_PHRASES_CLOZE_QnContext}/>
               <GenericRightColumn QnContextToUse={usePSLE_PHRASES_CLOZE_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePSLE_PHRASES_CLOZE_QnContext}/>
            </Row>
         </Container>
      </PSLE_PHRASES_CLOZE_QnProvider>
   );
}
