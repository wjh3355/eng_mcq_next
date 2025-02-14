import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import Link from "next/link";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { fetchNumQns } from "@/lib/mongodb/shared-server-actions";
import toast from "react-hot-toast";

export default async function SpellingHomePage() {
   await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">PSLE Spelling</h5>
            </Col>
         </Row>

         <Row>
            <Col>                  
               <Suspense fallback={<Skeleton height={200}/>}>
                  <DisplaySpellingSets/>
               </Suspense>
            </Col>
         </Row>
      </Container>
   )
}

async function DisplaySpellingSets() {
   const totalNumQns = await fetchNumQns("spelling");
   if (typeof totalNumQns !== "number") { 
      toast.error(totalNumQns.error); 
      return;
   }

   const setSize = 50;

   const numPossibleSets = Math.ceil(totalNumQns / setSize);

   const links: React.JSX.Element[] = [];

   for (let setNum = 1; setNum <= numPossibleSets; setNum++) {
      links.push(
         <li key={setNum}>
            <Link href={`/spelling/${setNum}`}>
               {`Set ${setNum} (${(setNum-1)*setSize + 1} to ${
                  setNum*setSize <= totalNumQns
                  ?  setNum*setSize
                  :  totalNumQns
               })`}
            </Link>
         </li>
      )
   }

   links.push(
      <li key={numPossibleSets + 1} className="mt-2">
         <Link href={`/spelling/random`}>
            50 random questions
         </Link>
      </li>
   )

   return (
      <div className="card h-100 bg-light">
         <div className="card-body">
            <ul>
               {links}
            </ul>
         </div>
      </div>
   )
}