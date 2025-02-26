import { DEFINITION_SET_SIZE } from "@/definitions";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchNumQns } from "@/lib/mongodb/shared-server-actions";
import Link from "next/link";
import React, { Suspense } from "react";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

export default async function DefinitionsHomePage() {
   await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Definitions</h5>
            </Col>
         </Row>

         <Row>
            <Col>                  
               <Suspense fallback={<Skeleton height={200}/>}>
                  <DisplayDefSets/>
               </Suspense>
            </Col>
         </Row>
      </Container>
   )
}

async function DisplayDefSets() {
   const totalNumQns = await fetchNumQns("definition");
   if (typeof totalNumQns !== "number") { 
      toast.error(totalNumQns.error); 
      return;
   }

   const numPossibleSets = Math.ceil(totalNumQns / DEFINITION_SET_SIZE);

   const links: React.ReactNode[] = [];

   for (let setNum = 1; setNum <= numPossibleSets; setNum++) {
      links.push(
         <li key={setNum}>
            <Link href={`/definitions/${setNum}`}>
               {`Set ${setNum} (${(setNum-1)*DEFINITION_SET_SIZE + 1} to ${
                  setNum*DEFINITION_SET_SIZE <= totalNumQns
                  ?  setNum*DEFINITION_SET_SIZE
                  :  totalNumQns
               })`}
            </Link>
         </li>
      )
   }

   links.push(
      <li key={numPossibleSets + 1} className="mt-2">
         <Link href={`/definitions/random`}>
            50 random questions
         </Link>
      </li>
   )

   return (
      <div className="card h-100 bg-light border-0 shadow">
         <div className="card-body">
            <ul>
               {links}
            </ul>
         </div>
      </div>
   )
}
