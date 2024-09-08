'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { createGenericMCQProvider } from "@/app/ui/components/GenericMCQProvider";
import { PSLE_MCQ_AllowedSetConfigs } from "@/lib/data";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('psle_mcq', PSLE_MCQ_AllowedSetConfigs);
const PSLE_MCQ_QnProvider = GenericMCQProvider;
const usePSLE_MCQ_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSet } = usePSLE_MCQ_QnContext();

   return (
      <h4 className="text-center m-0">
         PSLE Words MCQ: <strong>{qnSet}</strong>
      </h4>
   );
};

export default function PSLE_MCQ_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PSLE_MCQ_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePSLE_MCQ_QnContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePSLE_MCQ_QnContext}/>
               <GenericRightColumn QnContextToUse={usePSLE_MCQ_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePSLE_MCQ_QnContext}/>
            </Row>
         </Container>
      </PSLE_MCQ_QnProvider>
   );
}
