import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import fetchQnArrFromDB from "@/lib/fetchQnArrFromDB";
import fetchUserData from "@/lib/fetchUserData";
import { QN_CATEGORIES_DATA, CurrentQnCategoriesTracked } from "@/types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import { Suspense } from "react";
import PaginatedDictEntries from "@/app/ui/components/PaginatedDictEntries";
import { TriangleAlert } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ cat: CurrentQnCategoriesTracked }> }) {

   const currUser = await checkNormalUserAuth();
   const userData = await fetchUserData(currUser.given_name!);
   const { cat } = await params;

   const wrongQnNumsArr = userData.qnData[cat]?.wrongQnNums ?? [];

   return ( 
      <Container className="mb-4">
         <Row className="my-3">
            <h5 className="text-center m-0">{QN_CATEGORIES_DATA[cat].name}: Incorrect Questions</h5>
         </Row>

         {
            wrongQnNumsArr.length === 0
            ?  <Row>
                  <Col>
                     <Alert variant="info" className="d-flex align-items-center">
                        <TriangleAlert/>&nbsp;<strong>You have no incorrect questions for this category</strong>
                     </Alert>
                  </Col>
               </Row>
            :  <Suspense fallback={<div className="d-flex justify-content-center">Fetching data...</div>}>
                  <ShowEntriesWithPagination wrongQnNumsArr={wrongQnNumsArr} cat={cat}/>
               </Suspense>
         }
      </Container>
   );
}

async function ShowEntriesWithPagination({ wrongQnNumsArr, cat }: { wrongQnNumsArr: number[], cat: CurrentQnCategoriesTracked }) {
   let wrongQnObjArr;
   try {
      wrongQnObjArr = await fetchQnArrFromDB(
         cat,
         wrongQnNumsArr
      );
      return <PaginatedDictEntries qnObjArr={wrongQnObjArr}/>
   } catch (error) {
      return <p>Error loading incorrect questions.</p>;
   }
}