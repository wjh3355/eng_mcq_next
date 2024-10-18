'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/components/GenericMCQProvider";

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

import { QnCategoryDataType } from "@/lib/data";
import { notFound } from "next/navigation";

export default function GenericMCQApp({ 
   qnCategory,
   slug,
   headerOverride
}: { 
   qnCategory: QnCategoryDataType, 
   slug: string | undefined ,
   headerOverride? : string
}) {

   const qnSet = qnCategory.sets.find(set => set.slug === slug);
   if (!qnSet) notFound();

   const { MCQProvider, useMCQContext } = createGenericMCQProvider(
      qnCategory.mongoCollection,
      qnSet.qnNumRange
   );

   return (
      <MCQProvider>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useMCQContext}/>
               <h4 className="text-center m-0">
                  {headerOverride || qnCategory.name + " - " + qnSet.name}
               </h4>
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useMCQContext}/>
               <GenericRightColumn QnContextToUse={useMCQContext}/>
            </Row>
            <Row className="my-3">
               <GenericAnsIndicator QnContextToUse={useMCQContext}/>
            </Row>
         </Container>
      </MCQProvider>
   );
}