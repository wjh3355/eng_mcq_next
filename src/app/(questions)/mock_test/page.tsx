import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import Container from "react-bootstrap/esm/Container";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import toast from "react-hot-toast";
import { fetchNumMockTests } from "@/lib/mongodb/mt-server-actions";
import { MockTestUserDat } from "@/definitions";

export const dynamic = 'force-dynamic';

export default async function MockTestsHomePage() {

   const { mockTestData } = await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <h5 className="m-0 text-center">Mock Tests</h5>
         </Row>
         <Suspense fallback={<Skeleton height={40}/>}>
            <MockTestsTable mockTestData={mockTestData}/>
         </Suspense>
      </Container>
   );
}

async function MockTestsTable({ mockTestData }: { mockTestData: MockTestUserDat[] }) {
   const numMT = await fetchNumMockTests();
   if (typeof numMT !== "number") {
      toast.error(numMT.error);
      return;
   }

   return (
      <Row>
         <Col xl={6} lg={8} md={10} className="mx-auto">
            <Table striped="columns" className="shadow">
               <thead>
                  <tr>
                     <th>Number</th>
                     <th>Your score</th>
                     <th>Date attempted</th>
                  </tr>
               </thead>
               <tbody>
                  {Array.from({ length: numMT }, (_, i) => {

                     const mtData = mockTestData.find(mtd => mtd.mockTestNumber === i+1);

                     return (
                        <tr key={i+1}>
                           <td>
                              <Link href={`/mock_test/${i+1}`}>
                                 {`Mock Test ${i+1}`}
                              </Link>
                           </td>
                           <td>
                              {mtData ? `${mtData.score} / 47` : ''}
                           </td>
                           <td>
                              {mtData?.dateAttempted ? mtData.dateAttempted.toLocaleDateString() + " " + mtData.dateAttempted.toLocaleTimeString() : ''}
                           </td>
                        </tr>
                     );
                  })}
                  <tr>
                     <td colSpan={3}>
                        <div className="text-center text-secondary fst-italic">
                           More coming soon
                        </div>
                     </td>
                  </tr>
               </tbody>
            </Table>
         </Col>
      </Row>
   );
}