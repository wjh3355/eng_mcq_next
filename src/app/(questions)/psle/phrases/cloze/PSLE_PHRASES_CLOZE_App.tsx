'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnCategoriesData from "@/lib/data";

const { 
   GenericMCQProvider: PSLEPhrasesClozeProvider,
   useGenericMCQContext: usePSLEPhrasesClozeQnContext
} = createGenericMCQProvider(qnCategoriesData.pslePhrasesCloze);

import GenericQnTitle from "@/app/ui/components/GenericQnTitle";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

export default function PSLE_CLOZE_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PSLEPhrasesClozeProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePSLEPhrasesClozeQnContext}/>
               <GenericQnTitle QnContextToUse={usePSLEPhrasesClozeQnContext} />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePSLEPhrasesClozeQnContext}/>
               <GenericRightColumn QnContextToUse={usePSLEPhrasesClozeQnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePSLEPhrasesClozeQnContext}/>
            </Row>
         </Container>
      </PSLEPhrasesClozeProvider>
   );
}
