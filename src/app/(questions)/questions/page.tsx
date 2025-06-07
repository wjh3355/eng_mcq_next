import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
   Collections,
   QN_COL_DATA,
   questionCategoriesArray,
} from "@/definitions";
import Link from "next/link";
import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import Container from "react-bootstrap/esm/Container";
import toast from "react-hot-toast";
import { fetchNumQuestions } from "@/lib/mongodb/question-server-actions";

export const dynamic = "force-dynamic";

export default async function QuestionsHomepage() {
   await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Question Sets</h5>
            </Col>
         </Row>

         <Row>
            {questionCategoriesArray.map((col) => (
               <Col key={col} xl={3} lg={4} md={6} className="mb-3">
                  <Suspense fallback={<Skeleton height={200} />}>
                     <DisplayCategorySets collection={col} />
                  </Suspense>
               </Col>
            ))}
         </Row>
      </Container>
   );
}

async function DisplayCategorySets({ collection }: { collection: Collections }) {

   // if collection is "demo" or "test", return nothing
   // demo will be in another route
   // test is hidden
   if (collection === "demo" || collection === "test") return;

   // get number of questions in collection
   const numQnsInCollection = await fetchNumQuestions(collection);
   if (typeof numQnsInCollection !== "number") {
      toast.error(numQnsInCollection.error);
      return;
   }

   // get number of questions in a set
   const { setSize, categoryName } = QN_COL_DATA[collection];

   // calculate number of possible sets
   // eg. if 123 questions and setSize = 50
   // we get 2 sets of 50, 1 set of 23
   // total 3
   // which is Ceil(123/50) = 3
   const numPossibleSets = Math.ceil(numQnsInCollection / setSize);

   const links: React.ReactNode[] = [];

   for (let setNum = 1; setNum <= numPossibleSets; setNum++) {
      
      // eg. set 1 is from 1 to 50
      // set 2 is from 51 to 100
      // set 3 is from 101 to 123
      links.push(
         <li key={setNum}>
            <Link href={`/questions/${collection}/${setNum}`}>
               {`Set ${setNum} (${(setNum - 1) * setSize + 1} to ${Math.min(setNum * setSize, numQnsInCollection)})`}
            </Link>
         </li>
      );
   }

   // add random questions link (random selection of questions)
   links.push(
      <li key={numPossibleSets + 1} className="mt-2">
         <Link href={`/questions/${collection}/random`}>{setSize} random questions</Link>
      </li>
   );

   return (
      <div className="card h-100 bg-light border-0 shadow">
         <div className="card-header">{categoryName}</div>
         <div className="card-body">
            <ul>{links}</ul>
         </div>
      </div>
   );
}