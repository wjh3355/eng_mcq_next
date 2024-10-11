'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnCategoriesData from "@/lib/data";

const { 
   GenericMCQProvider: PSLEWordsClozeProvider, 
   useGenericMCQContext: usePSLEWordsClozeQnContext
} = createGenericMCQProvider(qnCategoriesData.psleWordsCloze);

import GenericQnTitle from "@/app/ui/components/GenericQnTitle";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

export default function PSLE_CLOZE_App({ slug }: { slug: string[] | undefined }) {
   return (
      <PSLEWordsClozeProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePSLEWordsClozeQnContext}/>
               <GenericQnTitle QnContextToUse={usePSLEWordsClozeQnContext} />
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePSLEWordsClozeQnContext}/>
               <GenericRightColumn QnContextToUse={usePSLEWordsClozeQnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePSLEWordsClozeQnContext}/>
            </Row>
         </Container>
      </PSLEWordsClozeProvider>
   );
}
