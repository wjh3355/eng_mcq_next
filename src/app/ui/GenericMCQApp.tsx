'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

import { QnCategoryDataType } from "@/lib/data";
import { notFound } from "next/navigation";

export default function GenericMCQApp({ 
   qnCategory,
   slug,
   headerOverride,
   userName,
   trackQns
}: { 
   qnCategory: QnCategoryDataType, 
   slug: string | undefined ,
   userName: string
   headerOverride?: string,
   trackQns: boolean
}) {

   const qnSet = qnCategory.sets.find(set => set.slug === slug);
   if (!qnSet) notFound();

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategoryName: qnCategory.name, 
      qnMongoCollection: qnCategory.mongoCollection,
      qnNumRange: qnSet.qnNumRange,
      userName,
      trackQns
   });

   return (
      <MCQProvider>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useMCQContext}/>
               <h5 className="text-center m-0">
                  {headerOverride || qnCategory.name + " - " + qnSet.name}
               </h5>
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