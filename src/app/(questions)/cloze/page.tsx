import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import Container from "react-bootstrap/esm/Container";
import { fetchAllCloze } from "@/lib/mongodb/cloze-server-actions";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import toast from "react-hot-toast";
import { ClozeUserDat } from "@/definitions";

export const dynamic = 'force-dynamic';

export default async function ClozeHomePage() {

   const { clozeData } = await checkAuthForRoute();

   return (
      <Container>
         <Row className="my-3">
            <h5 className="m-0 text-center">Comprehension Cloze</h5>
         </Row>
         <Suspense fallback={<Skeleton height={40}/>}>
            <ClozeTable clozeData={clozeData}/>
         </Suspense>
      </Container>
   );
}

async function ClozeTable({ clozeData }: { clozeData: ClozeUserDat[] }) {
   const ClozeArr = await fetchAllCloze();
   if ("error" in ClozeArr) {
      toast.error(ClozeArr.error);
      return;
   }

   return (
      <Row>
         <Col xl={6} lg={8} md={10} className="mx-auto">
            <Table striped className="shadow">
               <tbody>
                  {ClozeArr.map(({ qnNum, title }) => 
                     <tr key={qnNum}>
                        <td>
                           <Link href={`/cloze/${qnNum}`}>
                              {`${qnNum}: ${title} ${clozeData.some(cz => cz.qnNum === qnNum) ? '✅' : ''}`}
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