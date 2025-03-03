"use client";

import { Question } from '@/definitions';
import QuestionExplanation from './QuestionExplanation';
import Pagination from "react-bootstrap/Pagination";
import { useState } from "react";

const itemsPerPg = 10;

export default function QuestionPaginatedExplanation({ qnObjArr }: { qnObjArr: Question[] }) {

   const [currPage, setCurrPage] = useState<number>(1);
   
   const totalNumOfPages = Math.ceil(qnObjArr.length/itemsPerPg);

   const startingIdxForThisPg = (currPage - 1) * itemsPerPg;
   const displayedQns = qnObjArr
      .slice(startingIdxForThisPg, startingIdxForThisPg + itemsPerPg)
      .map((qn, i) => <QuestionExplanation key={i} qnObj={qn} num={startingIdxForThisPg + i + 1} />);
   
   let navigablePgNums: number[] = [];
   if (totalNumOfPages >= 3) {
      if (currPage === 1) {
         navigablePgNums = [1, 2, 3];
      } else if (currPage === totalNumOfPages) {
         navigablePgNums = [totalNumOfPages-2, totalNumOfPages-1, totalNumOfPages];
      } else {
         navigablePgNums = [currPage-1, currPage, currPage+1]
      }
   } else if (totalNumOfPages === 2) {
      navigablePgNums = [1, 2];
   }

   if (qnObjArr.length === 0) return <section className="text-center text-secondary">You have no incorrect questions yet</section>

   return (
      <section>
         {totalNumOfPages > 1 &&
            <Pagination size="sm">
               <Pagination.First onClick={() => setCurrPage(1)}/>
               {navigablePgNums.map(pgNum => 
                  <Pagination.Item 
                     key={pgNum}
                     active={pgNum === currPage}
                     onClick={() => setCurrPage(pgNum)}
                     style={{width: "70px", textAlign: "center"}}
                  >
                     {
                        pgNum === totalNumOfPages 
                           ? pgNum*10-9 + " - " + qnObjArr.length
                           : pgNum*10-9 + " - " + pgNum*10
                     }
                  </Pagination.Item>
               )}
               <Pagination.Last onClick={() => setCurrPage(totalNumOfPages)}/>
            </Pagination>
         }
         <div className="vstack gap-5">{displayedQns}</div>
      </section>
   )
}