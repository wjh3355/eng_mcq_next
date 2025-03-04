import { Suspense } from "react";

import { notFound } from "next/navigation";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";

import Skeleton from "react-loading-skeleton";

import { Collections, QN_COL_DATA } from "@/definitions";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";
import QuestionPaginatedExplanation from "@/components/question/QuestionPaginatedExplanation";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ collection: Collections }> }) {

   const user = await checkAuthForRoute();
   const { collection } = await params;

   const wrongQnNumsArr = user.qnData[collection]?.wrongQnNums ?? [];

   if (wrongQnNumsArr.length === 0) notFound();

   return ( 
      <Container>
         <Row className="my-3">
            <h5 className="text-center m-0">{QN_COL_DATA[collection].categoryName}: Incorrect Questions</h5>
         </Row>

         <Suspense fallback={<Skeleton height={40}/>}>
            <ShowEntriesWithPagination wrongQnNumsArr={wrongQnNumsArr} collection={collection}/>
         </Suspense>

      </Container>
   );
}

async function ShowEntriesWithPagination({ wrongQnNumsArr, collection }: { wrongQnNumsArr: number[], collection: Collections }) {
   const res = await fetchQuestion(collection, ...wrongQnNumsArr);
   if ("error" in res) return <p>Error loading incorrect questions.</p>;
   return <QuestionPaginatedExplanation qnObjArr={res}/>;
}