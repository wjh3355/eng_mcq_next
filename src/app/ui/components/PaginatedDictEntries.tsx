"use client";

import { QnObj } from "@/types";
import DictionaryEntry from "./DictionaryEntry";
import Pagination from "react-bootstrap/Pagination";
import { useState } from "react";

const itemsPerPg = 10;

export default function PaginatedDictEntries({ qnObjArr }: { qnObjArr: QnObj[] }) {

   const [currPage, setCurrPage] = useState<number>(1);
   
   const totalNumOfPages = Math.ceil(qnObjArr.length/itemsPerPg);

   const startingIdxForThisPg = (currPage - 1) * itemsPerPg;
   const displayedQns = qnObjArr
      .slice(startingIdxForThisPg, startingIdxForThisPg + itemsPerPg)
      .map((qn, i) => <DictionaryEntry key={i} qnObj={qn} num={startingIdxForThisPg + i + 1} />);
   
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