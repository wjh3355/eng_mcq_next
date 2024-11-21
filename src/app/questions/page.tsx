import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import { CurrentQnCategories, QN_CATEGORIES_DATA, QnSet } from "@/types";
import Link from "next/link";

export default async function Page() {
   await checkNormalUserAuth();

   return <Container>
      <Row className="my-3">
         <Col>
            <h5 className="m-0 text-center">Questions</h5>
         </Col>
      </Row>

      <Row>
            {(Object.entries(QN_CATEGORIES_DATA) as 
               [
                  CurrentQnCategories, { name: string, sets: QnSet[] }
               ][]
            ).filter(([cat]) => cat !== "debug" && cat !== "demo")
               .map(([cat, {name, sets}]) => (
                  <Col key={cat} lg={3} md={5} sm={7} 
                  className="rounded border border-1 mx-3 mb-3 p-3">
                     {name}
                     <ul>
                        {sets.map(({name, href, qnNumRange}) => (
                           <li key={name}>
                              <Link
                                 href={href}
                              >
                                 {name}&ensp;({qnNumRange[0]}&nbsp;to&nbsp;{qnNumRange[1]-1})
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </Col>
               )
            )}
      </Row>
   </Container>
}