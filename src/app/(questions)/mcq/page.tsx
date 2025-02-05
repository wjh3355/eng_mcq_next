import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { QnCategory, QN_CATEGORIES_DATA, QnCategoryUserData, qnCategoriesArray, UserProfileDocument } from "@/definitions"
import Link from "next/link";
import React, { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import Container from "react-bootstrap/esm/Container";
import { fetchNumQns } from "@/lib/mongodb/get-qns-server";

export const dynamic = 'force-dynamic';

export default async function MCQHomePage() {
   const user = await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">MCQ Question Sets</h5>
            </Col>
         </Row>

         <Row>
            {qnCategoriesArray.map(category => 
               <Col key={category} xl={3} lg={4} md={6} className="mb-3">                  
                  <Suspense fallback={<Skeleton height={200}/>}>
                     <DisplayCategorySets category={category}/>
                  </Suspense>
               </Col>
            )}
         </Row>

         <Row className="my-3">
            <Suspense fallback={<p>Loading wrong questions (if any)...</p>}>
               <WrongQnsTable user={user}/>
            </Suspense>
         </Row>
      </Container>
   )
}

async function DisplayCategorySets({ category }: { category: QnCategory }) {
   const totalNumQns = await fetchNumQns(category);

   const { setSize, categoryName } = QN_CATEGORIES_DATA[category];
   const numPossibleSets = Math.ceil(totalNumQns / setSize);

   const links: React.JSX.Element[] = [];

   if (category !== "phrasalVerbs") {
      for (let setNum = 1; setNum <= numPossibleSets; setNum++) {
         links.push(
            <li key={setNum}>
               <Link href={`/mcq/${category}/sets/${setNum}`}>
                  {`Set ${setNum} (${(setNum-1)*setSize + 1} to ${
                     setNum*setSize <= totalNumQns
                     ?  setNum*setSize
                     :  totalNumQns
                  })`}
               </Link>
            </li>
         )
      }
   } else {
      for (let setNum = 1; setNum <= numPossibleSets-2; setNum++) {
         links.push(
            <li key={setNum}>
               <Link href={`/mcq/${category}/sets/${setNum}`}>
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
         <li key={7} className="mt-2">
            <Link href={`/mcq/${category}/sets/common`}>
               60 Commonly Tested
            </Link>
         </li>
      )
   }

   links.push(
      <li key={numPossibleSets + 1} className="mt-2">
         <Link href={`/mcq/${category}/sets/random`}>
            50 random questions
         </Link>
      </li>
   )

   return (
      <div className="card h-100 bg-light">
         <div className="card-header">{categoryName}</div>
         <div className="card-body">
            <ul>
               {links}
            </ul>
         </div>
      </div>
   )
}

async function WrongQnsTable({ user }: { user: UserProfileDocument }) {

   const { qnData } = user;

   if (JSON.stringify(qnData) === "{}") return null;

   return <Col xl={6} lg={8} md={10} className="mx-auto">
      <h5 className="m-0 text-center">Redo Wrong Questions</h5>
      <Table striped>
         <thead>
            <tr>
               <th>Category</th>
               <th>No. Incorrect</th>
            </tr>
         </thead>
         <tbody>
            {
               (Object.entries(qnData) as [ QnCategory, QnCategoryUserData ][])
                  .filter(([_, { wrongQnNums }]) => wrongQnNums.length > 0)
                  .map(([cat, { wrongQnNums }], idx) => 
                     <tr key={idx}>
                        <td>
                           <Link className="me-1" href={`/mcq/${cat}/redo`}>
                              {QN_CATEGORIES_DATA[cat].categoryName}
                           </Link>
                        </td>
                        <td>
                           {wrongQnNums.length}
                        </td>
                     </tr>
                  )
            }
         </tbody>
      </Table>
   </Col>;
}