import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import { QnCategory, QN_CATEGORIES_DATA, QnCategoryUserData } from "@/types";
import Link from "next/link";
import fetchUserData from "@/serverFuncs/fetchUserData";
import MCQDisplayGrid from "../ui/components/MCQDisplayGrid";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const user = await checkNormalUserAuth();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">MCQ Question Sets</h5>
            </Col>
         </Row>

         <Row>
            <MCQDisplayGrid/>
         </Row>

         <Suspense fallback={<Skeleton height={40}/>}>
            <WrongQnsTable user={user.given_name!}/>
         </Suspense>

      </Container>
   )
}

async function WrongQnsTable({ user }: { user: string }) {

   const userQnData = (await fetchUserData(user)).qnData;

   if (JSON.stringify(userQnData) === "{}") return null;

   return <>
      <Row className="my-3">
         <Col>
            <h5 className="m-0 text-center">Redo Wrong Questions</h5>
         </Col>
      </Row>
      <Row>
         <Col xl={6} lg={8} md={10} className="mx-auto">
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
                                 <Link className="me-1" href={`/mcq/redo/${cat}`}>
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
         </Col>
      </Row>
   </>;
}