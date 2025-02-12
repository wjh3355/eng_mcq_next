import { Suspense } from "react";

import Link from "next/link";

import { fetchMcqQnArr } from "@/lib/mongodb/mcq-server-actions";
import PaginatedDictEntries from "@/components/dict/PaginatedDictEntries";
import { QN_CATEGORIES_DATA, QnCategory } from "@/definitions";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { RotateCcw } from 'lucide-react';
import { notFound } from "next/navigation";
import Skeleton from "react-loading-skeleton";
import { checkAuthForRoute } from "@/lib/auth/checkAuthForRoute";
import Container from "react-bootstrap/esm/Container";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ category: QnCategory }> }) {

   const user = await checkAuthForRoute();
   const { category } = await params;

   const wrongQnNumsArr = user.qnData[category]?.wrongQnNums ?? [];

   if (wrongQnNumsArr.length === 0) notFound();

   return ( 
      <Container>
         <Row className="my-3">
            <h5 className="text-center m-0">{QN_CATEGORIES_DATA[category].categoryName}: Incorrect Questions</h5>
         </Row>

         <Suspense fallback={<Skeleton height={40}/>}>
            <ShowEntriesWithPagination wrongQnNumsArr={wrongQnNumsArr} category={category}/>
         </Suspense>

      </Container>
   );
}

async function ShowEntriesWithPagination({ wrongQnNumsArr, category }: { wrongQnNumsArr: number[], category: QnCategory }) {
   try {
      return <>
         <PaginatedDictEntries qnObjArr={await fetchMcqQnArr(category, wrongQnNumsArr)}/>
         <Row className="my-4">
            <Col className="d-flex justify-content-end">
               <Link
                  href={`/mcq/${category}/redo`}
                  className="btn btn-warning d-flex align-items-center"
               >
                  <RotateCcw size={22} strokeWidth={2}/>&nbsp;<strong>Attempt Questions Again</strong>
               </Link>
            </Col>
         </Row>
      </>
   } catch (error) {
      return <p>Error loading incorrect questions.</p>;
   }
}