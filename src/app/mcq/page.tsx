import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import { CurrentQnCategories, QN_CATEGORIES_DATA, QnSet } from "@/types";
import Link from "next/link";
import fetchUserData from "@/serverFuncs/fetchUserData";

export const dynamic = 'force-dynamic';

export default async function Page() {

   const user = await checkNormalUserAuth();
   const userQnData = (await fetchUserData(user.given_name!)).qnData;

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">MCQ Question Sets</h5>
            </Col>
         </Row>

         <Row>
               {(Object.entries(QN_CATEGORIES_DATA) as 
                  [
                     CurrentQnCategories, { name: string, sets: QnSet[] }
                  ][]
               )
                  .map(([cat, {name, sets}]) => (
                     <Col key={cat} lg={3} md={5} sm={6} className="mb-4">
                        <div className="card">
                           <div className="card-header">
                              {name}
                           </div>
                           <div className="card-body">
                              <ul>
                                 {sets.map(({name, href, qnNumRange}) => (
                                    <li key={name}>
                                       <Link
                                          href={href}
                                       >
                                          {
                                             name === "Random"
                                             ?  `50 random questions`
                                             :  `${name} (${qnNumRange[0]} to ${qnNumRange[1]})`
                                          }
                                       </Link>
                                    </li>
                                 ))}
                              </ul>
                           </div>
                        </div>
                     </Col>
                  )
               )}
         </Row>

         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Redo Wrong Questions</h5>
            </Col>
         </Row>

         <Row>
            <Col>
               <ul>
                  {
                     (Object.entries(userQnData) as [ CurrentQnCategories, { wrongQnNums: number[] } ][])
                        .filter(([_, { wrongQnNums }]) => wrongQnNums.length > 0)
                        .map(([cat, { wrongQnNums }], idx) => 
                           <li key={idx}>
                              <Link
                                 className="me-1"
                                 href={`/mcq/redo/${cat}`}
                              >
                                 {QN_CATEGORIES_DATA[cat].name}
                              </Link>
                              ({wrongQnNums.length})
                           </li>
                        )
                  }
               </ul>
            </Col>
         </Row>

      </Container>
   )
}