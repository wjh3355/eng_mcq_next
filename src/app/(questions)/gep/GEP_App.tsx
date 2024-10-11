'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import qnCategoriesData from "@/lib/data";

const { 
   GenericMCQProvider: GEPProvider,
   useGenericMCQContext: useGEPQnContext,
} = createGenericMCQProvider(qnCategoriesData.gep);

import GenericQnTitle from "@/app/ui/components/GenericQnTitle";
import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

export default function GEP_App({ slug }: { slug: string[] | undefined }) {


   return (
      <GEPProvider slug={slug}>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useGEPQnContext}/>
               <GenericQnTitle QnContextToUse={useGEPQnContext}/>
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useGEPQnContext}/>
               <GenericRightColumn QnContextToUse={useGEPQnContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useGEPQnContext}/>
            </Row>
         </Container>
      </GEPProvider>
   );
}
