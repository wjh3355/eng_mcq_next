import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import { fetchClozeArr } from "@/serverFuncs/fetchCloze";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

export const dynamic = 'force-dynamic';

export default async function Page() {

   await checkNormalUserAuth();
   const clozeObjArr = await fetchClozeArr();

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Comprehension Cloze</h5>
            </Col>
         </Row>

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
                              More coming soon...
                           </div>
                        </td>
                     </tr>
                  </tbody>
               </Table>
            </Col>
         </Row>

      </Container>
   );
}