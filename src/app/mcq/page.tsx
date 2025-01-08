import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { QnCategory, QN_CATEGORIES_DATA, QnCategoryUserData, qnCategoriesArray } from "@/types";
import Link from "next/link";
import fetchUserData from "@/serverFuncs/fetchUserData";
import React, { Suspense } from "react";
import { fetchNumQns } from "@/serverFuncs/qnActions";
import getUserDataHeaders from "@/serverFuncs/getUserDataHeaders";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const { kindeUserGivenName } = await getUserDataHeaders();

   return (
      <>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">MCQ Question Sets</h5>
            </Col>
         </Row>

         <Row>
            {qnCategoriesArray.map(category => 
               <Suspense fallback={<div/>} key={category}>
                  <DisplayCategorySets category={category}/>
               </Suspense>
            )}
         </Row>

         <Row className="my-3">
            <Suspense fallback={<p>Loading wrong questions (if any)...</p>}>
               <WrongQnsTable user={kindeUserGivenName}/>
            </Suspense>
         </Row>
      </>
   )
}

async function DisplayCategorySets({ category }: { category: QnCategory }) {
   const totalNumQns = await fetchNumQns(category);
   const { setSize, categoryName } = QN_CATEGORIES_DATA[category];
   const numPossibleSets = Math.floor(totalNumQns / setSize);

   const links: React.JSX.Element[] = [];

   for (let setNum = 1; setNum <= numPossibleSets; setNum++) {
      links.push(
         <li key={setNum}>
            <Link href={`/mcq/${category}/sets/${setNum}`}>
               {`Set ${setNum} (${(setNum-1)*setSize + 1} to ${setNum*setSize})`}
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
      <Col key={category} xl={3} lg={4} md={6} className="mb-3">
         <div className="card h-100 bg-light">
            <div className="card-header">{categoryName}</div>
            <div className="card-body">
               <ul>
                  {links}
               </ul>
            </div>
         </div>
      </Col>
   )
}

async function WrongQnsTable({ user }: { user: string }) {

   const userQnData = (await fetchUserData(user)).qnData;

   if (JSON.stringify(userQnData) === "{}") return null;

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
               (Object.entries(userQnData) as [ QnCategory, QnCategoryUserData ][])
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