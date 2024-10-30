import checkNormalUserAuth from "@/lib/checkNormalUserAuth";
import fetchQnArrFromDB from "@/lib/fetchQnArrFromDB";
import fetchUserStats from "@/lib/fetchUserStats";
import { notFound } from "next/navigation";
import { QN_CATEGORIES_DATA, CurrentQnCategories, UserData } from "@/types";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Suspense } from "react";
import PaginatedDictEntries from "@/app/ui/components/PaginatedDictEntries";

export default async function Page({ params }: { params: { cat: CurrentQnCategories } }) {

   const currUser = await checkNormalUserAuth();
   const userData = await fetchUserStats(currUser.given_name!);

   if (!(params.cat in userData)) notFound();

   return ( 
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="text-center m-0">{QN_CATEGORIES_DATA[params.cat].name}: Incorrect Questions</h5>
            </Col>
         </Row>

         <Suspense fallback={<Row><p>Loading all incorrect questions...</p></Row>}>
            <ShowEntriesWithPagination userData={userData} qnCat={params.cat}/>
         </Suspense>
      </Container>
   );
}

async function ShowEntriesWithPagination({ userData, qnCat }: { userData: UserData, qnCat: CurrentQnCategories }) {
   let wrongQnObjArr;
   try {
      wrongQnObjArr = await fetchQnArrFromDB(
         QN_CATEGORIES_DATA[qnCat].mongoCollection, 
         userData[qnCat]!.wrongQnNums
      );
      return <PaginatedDictEntries qnObjArr={wrongQnObjArr}/>
   } catch (error) {
      return <p>Error loading incorrect questions.</p>;
   }
}