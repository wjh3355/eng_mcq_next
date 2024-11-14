'use client';

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import createGenericMCQProvider from "@/app/ui/GenericMCQProvider";

import GenericLeftColumn from "@/app/ui/components/GenericLeftColumn";
import GenericRightColumn from "@/app/ui/components/GenericRightColumn";
import GenericErrorContainer from "@/app/ui/components/GenericErrorContainer";

import { QN_CATEGORIES_DATA, CurrentQnCategories } from "@/types";

import { notFound } from "next/navigation";
import { usePathname } from "next/navigation";

export default function GenericMCQApp({
   qnCategory,
   userName,
   header
}: {
   qnCategory: CurrentQnCategories
   userName?: string | null,
   header?: string
}) {

   const path = usePathname();

   const cat = QN_CATEGORIES_DATA[qnCategory];

   const set = cat.sets.find(set => set.href === path);
   
   if (!set) notFound();

   const { MCQProvider, useMCQContext } = createGenericMCQProvider({
      qnCategory,
      qnNumRange: set.qnNumRange,
      userName,
      trackQns: cat.isTracked
   });

   return (
      <MCQProvider>
         <Container className="mb-4">
            <Row className="my-3">
               <Col>
                  <GenericErrorContainer QnContextToUse={useMCQContext}/>
                  <h5 className="text-center m-0">
                     {header || cat.name + " - " + set.name}
                  </h5>
               </Col>
            </Row>
            <Row>
               <GenericLeftColumn QnContextToUse={useMCQContext}/>
               <GenericRightColumn QnContextToUse={useMCQContext}/>
            </Row>
         </Container>
      </MCQProvider>
   );
}