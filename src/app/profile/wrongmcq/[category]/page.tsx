import { Suspense } from "react";

import Link from "next/link";

import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";
import { fetchQnArr } from "@/serverFuncs/qnActions";
import fetchUserData from "@/serverFuncs/fetchUserData";
import PaginatedDictEntries from "@/app/ui/components/PaginatedDictEntries";
import { QN_CATEGORIES_DATA, QnCategory } from "@/types";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { RotateCcw } from 'lucide-react';
import { notFound } from "next/navigation";
import Skeleton from "react-loading-skeleton";

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ category: QnCategory }> }) {

   const currUser = await checkNormalUserAuth();
   const userData = await fetchUserData(currUser.given_name!);
   const { category } = await params;

   const wrongQnNumsArr = userData.qnData[category]?.wrongQnNums ?? [];

   if (wrongQnNumsArr.length === 0) notFound();

   return ( 
      <>
         <Row className="my-3">
            <h5 className="text-center m-0">{QN_CATEGORIES_DATA[category].categoryName}: Incorrect Questions</h5>
         </Row>

         <Suspense fallback={<Skeleton height={40}/>}>
            <ShowEntriesWithPagination wrongQnNumsArr={wrongQnNumsArr} category={category}/>
         </Suspense>

      </>
   );
}

async function ShowEntriesWithPagination({ wrongQnNumsArr, category }: { wrongQnNumsArr: number[], category: QnCategory }) {
   try {
      return <>
         <PaginatedDictEntries qnObjArr={await fetchQnArr(category, wrongQnNumsArr)}/>
         <Row className="my-4">
            <Col className="d-flex justify-content-end">
               <Link
                  href={`/mcq/redo/${category}`}
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