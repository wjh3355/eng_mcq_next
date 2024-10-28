'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericAnsIndicator from "@/app/ui/components/GenericAnsIndicator";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

import { QN_CATEGORIES_DATA, CurrentQnCategories } from "@/types";

import { notFound } from "next/navigation";

export default function GenericMCQApp({
   qnCategory,
   slug,
   headerOverride,
   userName,
}: {
   qnCategory: CurrentQnCategories
   slug: string | undefined ,
   userName: string
   headerOverride?: string,
}) {

   const qnCategoryData = QN_CATEGORIES_DATA[qnCategory];

   const qnSet = qnCategoryData.sets.find(set => set.slug === slug);
   
   if (!qnSet) notFound();

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory,
      qnMongoCollection: qnCategoryData.mongoCollection,
      qnNumRange: qnSet.qnNumRange,
      userName,
      trackQns: qnCategory !== "demo" && qnCategory !== "debug"
   });

   return (
      <MCQProvider>
         <Container>
            <Row className="my-3">
               <GenericErrorContainer QnContextToUse={useMCQContext}/>
               <h5 className="text-center m-0">
                  {headerOverride || qnCategoryData.name + " - " + qnSet.name}
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