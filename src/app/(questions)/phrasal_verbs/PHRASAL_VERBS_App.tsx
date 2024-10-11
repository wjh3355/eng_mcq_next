'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnCategoriesData from "@/lib/data";

const { 
   GenericMCQProvider: PhrasalVerbsProvider,
   useGenericMCQContext: usePhrasalVerbsQnContext
} = createGenericMCQProvider(qnCategoriesData.phrasalVerbs);

import GenericQnTitle from "@/app/ui/components/GenericQnTitle";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

export default function PHRASAL_VERBS_App({ slug }: { slug: string[] | undefined }) {

   return (
      <PhrasalVerbsProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={usePhrasalVerbsQnContext}/>
               <GenericQnTitle QnContextToUse={usePhrasalVerbsQnContext}/>
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={usePhrasalVerbsQnContext}/>
               <GenericRightColumn QnContextToUse={usePhrasalVerbsQnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={usePhrasalVerbsQnContext}/>
            </Row>
         </Container>
      </PhrasalVerbsProvider>
   );
}
