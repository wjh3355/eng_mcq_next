'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnSetIntervals from "@/lib/qnSetIntervals";

const { GenericMCQProvider, useGenericMCQContext } = 
   createGenericMCQProvider("psle_phrases_cloze", qnSetIntervals.psle_phrases_cloze);

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

function AppTitle() {

   const { qnSetName } = useGenericMCQContext();

   return (
      <h4 className="text-center m-0">
         PSLE Phrases Cloze: <strong>{qnSetName}</strong>
      </h4>
   );
};

export default function PSLE_CLOZE_App({ slug }: { slug: string[] | undefined }) {

   return (
      <GenericMCQProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useGenericMCQContext}/>
               <AppTitle />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useGenericMCQContext}/>
               <GenericRightColumn QnContextToUse={useGenericMCQContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useGenericMCQContext}/>
            </Row>
         </Container>
      </GenericMCQProvider>
   );
}
