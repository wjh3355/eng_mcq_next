import { Suspense } from "react";

import { notFound } from "next/navigation";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/Row";

import Skeleton from "react-loading-skeleton";

import { Collections, QN_COL_DATA } from "@/definitions";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";
import QuestionPaginatedExplanation from "@/components/question/QuestionPaginatedExplanation";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Link from "next/link";
import { RotateCcw } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ col: Collections }> }) {

   const user = await checkAuthForRoute();
   const { col } = await params;

   const wrongQnNumsArr = user.qnData[col]?.wrongQnNums ?? [];

   if (wrongQnNumsArr.length === 0) notFound();

   return ( 
      <Container>
         <Row className="my-3">
            <h5 className="text-center m-0">{QN_COL_DATA[col].categoryName}: Incorrect Questions</h5>
         </Row>

         <Suspense fallback={<Skeleton height={40}/>}>
            <ShowEntriesWithPagination wrongQnNumsArr={wrongQnNumsArr} col={col}/>
         </Suspense>

         <Row className="my-3">
            <Col className="d-flex">
               <Link href={`/profile/redo_questions/${col}`} className="btn btn-warning fw-bold mx-auto d-flex align-items-center gap-1">
                  <RotateCcw/>Redo Questions
               </Link>
            </Col>
         </Row>

      </Container>
   );
}

async function ShowEntriesWithPagination({ wrongQnNumsArr, col }: { wrongQnNumsArr: number[], col: Collections }) {
   const res = await fetchQuestion(col, ...wrongQnNumsArr);
   if ("error" in res) return <p>Error loading incorrect questions.</p>;
   return <QuestionPaginatedExplanation qnObjArr={res}/>;
}