"use client";

import { QnObj } from "@/types";
import DictionaryEntry from "./DictionaryEntry";
import Pagination from "react-bootstrap/Pagination";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useState } from "react";

export default function PaginatedDictEntries({ qnObjArr }: { qnObjArr: QnObj[] }) {

   const itemsPerPg = 10;
   
   const [currPage, setCurrPage] = useState<number>(1);
   
   const numPages = Math.ceil(qnObjArr.length/itemsPerPg);

   const startIdx = (currPage - 1) * itemsPerPg;
   const displayedQns = qnObjArr
      .slice(startIdx, startIdx + itemsPerPg)
      .map((qn, i) => <DictionaryEntry key={i} qnObj={qn} num={startIdx + i + 1} />);
   
   const Paginations = () => (
      <Row>
         <Col className="d-flex justify-content-end">
            <Pagination>
               <Pagination.First onClick={() => setCurrPage(1)}/>
               {Array.from({ length: numPages }, (_, idx) => (
                  <Pagination.Item 
                     key={idx+1}
                     active={idx+1 === currPage}
                     onClick={() => setCurrPage(idx+1)}
                  >{idx+1}</Pagination.Item>
               ))}
               <Pagination.Last onClick={() => setCurrPage(numPages)}/>
            </Pagination>
         </Col>
      </Row>
   );

   return (
      <>
         <Paginations/>
         <div className="vstack gap-5">{displayedQns}</div>
         <div className="my-4"/>
         <Paginations/>
      </>
   )
}