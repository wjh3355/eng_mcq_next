import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import fetchClozeArr from "@/serverFuncs/fetchClozeArr";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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

         <ul>
            {clozeObjArr.map(({ qnNum, title }) => 
               <li key={qnNum}>
                  <Link
                     href={`/cloze/${qnNum}`}
                  >
                     Cloze&nbsp;{qnNum}:&ensp;{title}
                  </Link>
               </li>
            )}
         </ul>
      </Container>
   );
}