'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnSetIntervals from "@/lib/qnSetIntervals";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider("psle_words_mcq", qnSetIntervals.psle_words_mcq);
const PSLE_WORDS_MCQ_QnProvider = GenericMCQProvider;
const usePSLE_WORDS_MCQ_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSetName } = usePSLE_WORDS_MCQ_QnContext();

   return (
      <h4 className="text-center m-0">
         PSLE Words MCQ: <strong>{qnSetName}</strong>
      </h4>
   );
};

export default function PSLE_WORDS_MCQ_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PSLE_WORDS_MCQ_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePSLE_WORDS_MCQ_QnContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePSLE_WORDS_MCQ_QnContext}/>
               <GenericRightColumn QnContextToUse={usePSLE_WORDS_MCQ_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePSLE_WORDS_MCQ_QnContext}/>
            </Row>
         </Container>
      </PSLE_WORDS_MCQ_QnProvider>
   );
}
