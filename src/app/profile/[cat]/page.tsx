import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import fetchQnArrFromDB from "@/lib/fetchQnArrFromDB";
import fetchUserStats from "@/lib/fetchUserStats";
import { notFound } from "next/navigation";
import { QN_CATEGORIES_DATA, CurrentQnCategoriesTracked } from "@/types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Suspense } from "react";
import PaginatedDictEntries from "@/app/ui/components/PaginatedDictEntries";

export default async function Page({ params }: { params: Promise<{ cat: CurrentQnCategoriesTracked }> }) {

   const currUser = await checkNormalUserAuth();
   const userData = await fetchUserStats(currUser.given_name!);
   const { cat } = await params;
   if (!(cat in userData.qnData)) notFound();

   return ( 
      <Container className="mb-4">
         <Row className="my-3">
            <Col>
               <h5 className="text-center m-0">{QN_CATEGORIES_DATA[cat].name}: Incorrect Questions</h5>
            </Col>
         </Row>

         <Suspense fallback={<Row><p>Loading all incorrect questions...</p></Row>}>
            <ShowEntriesWithPagination wrongQnNumsArr={userData.qnData[cat].wrongQnNums} qnCat={cat}/>
         </Suspense>
      </Container>
   );
}

async function ShowEntriesWithPagination({ wrongQnNumsArr, qnCat }: { wrongQnNumsArr: number[], qnCat: CurrentQnCategoriesTracked }) {
   if (wrongQnNumsArr.length === 0) return <p>No incorrect questions for this category.</p>;
   let wrongQnObjArr;
   try {
      wrongQnObjArr = await fetchQnArrFromDB(
         QN_CATEGORIES_DATA[qnCat].mongoCollection, 
         wrongQnNumsArr
      );
      return <PaginatedDictEntries qnObjArr={wrongQnObjArr}/>
   } catch (error) {
      return <p>Error loading incorrect questions.</p>;
   }
}