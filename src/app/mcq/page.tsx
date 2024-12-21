import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import checkNormalUserAuth from "@/serverFuncs/checkNormalUserAuth";
import { CurrentQnCategories, QN_CATEGORIES_DATA } from "@/types";
import Link from "next/link";
import fetchUserData from "@/serverFuncs/fetchUserData";
import McqGrid from "./McqGrid";

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
            <McqGrid/>
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
                              <Link className="me-1" href={`/mcq/redo/${cat}`}>
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