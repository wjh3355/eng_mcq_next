'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

import { createGenericMCQProvider } from "@/app/ui/components/GenericMCQProvider";
import { PSLE_CLOZE_AllowedSetConfigs } from "@/lib/data";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider('psle_cloze', PSLE_CLOZE_AllowedSetConfigs);
const PSLE_CLOZE_QnProvider = GenericMCQProvider;
const usePSLE_CLOZE_QnContext = useGenericMCQContext;

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSet } = usePSLE_CLOZE_QnContext();

   return (
      <h4 className="text-center m-0">
         PSLE Words Cloze: <strong>{qnSet}</strong>
      </h4>
   );
};

export default function PSLE_CLOZE_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PSLE_CLOZE_QnProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePSLE_CLOZE_QnContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePSLE_CLOZE_QnContext}/>
               <GenericRightColumn QnContextToUse={usePSLE_CLOZE_QnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePSLE_CLOZE_QnContext}/>
            </Row>
         </Container>
      </PSLE_CLOZE_QnProvider>
   );
}
