import { fetchAllClozeArr } from "@/utils/clozeActions";
import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import getUserDataHeaders from "@/utils/getUserDataHeaders";

export const dynamic = 'force-dynamic';

export default async function Page() {

   await getUserDataHeaders();

   return (
      <>
         <Row className="my-3">
            <h5 className="m-0 text-center">Comprehension Cloze</h5>
         </Row>
         <Suspense fallback={<Skeleton height={40}/>}>
            <ClozeTable/>
         </Suspense>
      </>
   );
}

async function ClozeTable() {
   const clozeObjArr = await fetchAllClozeArr();

   return (
      <Row>
         <Col xl={6} lg={8} md={10} className="mx-auto">
            <Table striped>
               <tbody>
                  {clozeObjArr.map(({ qnNum, title }) => 
                     <tr key={qnNum}>
                        <td>
                           <Link href={`/cloze/${qnNum}`}>
                              #{qnNum}&nbsp;{title}
                           </Link>
                        </td>
                     </tr>
                  )}
                  <tr>
                     <td>
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