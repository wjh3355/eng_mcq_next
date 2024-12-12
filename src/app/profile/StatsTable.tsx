"use client";

import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from "react-bootstrap/Modal";
import Popover from "react-bootstrap/Popover";
import Accordion from "react-bootstrap/Accordion";
import { CurrentQnCategoriesTracked, UserData } from "@/types";
import { QN_CATEGORIES_DATA } from "@/types";
import Link from "next/link";
import eraseUserData from "@/serverFuncs/eraseUserData";
import { Info } from "lucide-react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export default function StatsTable({ 
   userData,
   kindeUser
}: { 
   userData: UserData,
   kindeUser: KindeUser<Record<string, any>> 
}) {

   const [showCfmEraseData, setShowCfmEraseData] = useState<boolean>(false);

   return (
      <>
      
         <p>
            <strong>Username: </strong>
            {kindeUser.given_name}
         </p>

         <p>
            <strong>Email address: </strong>
            {kindeUser.email}
         </p>

         <p>
            <strong>Date created: </strong>
            {userData.dateCreated.toDateString()}
         </p>

         <p className="d-flex align-items-center">
            <strong>Total Score:&nbsp;</strong>
            {userData.score}&nbsp;

            <OverlayTrigger
               overlay={
                  <Popover>
                     <Popover.Body className="fs-6">
                        Every correct MCQ question answered earns you <strong>10</strong> points.
                     </Popover.Body>
                  </Popover>
               }
               trigger="click"
               placement="right"
            >
               <button
                  className="border-0 bg-transparent px-0"
               >
                  <Info size={17} strokeWidth={3} color="#808080" />
               </button>
            </OverlayTrigger>
         </p>

         <Accordion>
            <Accordion.Item eventKey="0">
               <Accordion.Header>Cloze</Accordion.Header>
               <Accordion.Body>
                  {
                     userData.clozeData.hasDoneCloze
                     ?  `Score: ${userData.clozeData.correctAns.length} / 15`
                     :  "You have not attempted the cloze yet!"
                  }
               </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
               <Accordion.Header>MCQ Questions</Accordion.Header>
               <Accordion.Body>
                  {
                     JSON.stringify(userData.qnData) === "{}"
                     ?  "You have not attempted any MCQ questions yet!"
                     :  <Table striped>
                           <thead>
                              <tr>
                                 <th>Category</th>
                                 <th>No. Attempted</th>
                                 <th>No. Incorrect</th>
                                 <th></th>
                              </tr>
                           </thead>
                           <tbody>
                              {(
                                 Object.entries(userData.qnData) as [
                                    CurrentQnCategoriesTracked,
                                    { numQnsAttempted: number; wrongQnNums: number[] }
                                 ][]
                              ).map(([cat, { numQnsAttempted, wrongQnNums }]) => (
                                 <tr key={cat}>
                                    <td>{QN_CATEGORIES_DATA[cat].name}</td>
                                    <td>{numQnsAttempted}</td>
                                    <td>{wrongQnNums.length}</td>
                                    {wrongQnNums.length === 0 ? (
                                       <td />
                                    ) : (
                                       <td>
                                          <Link
                                             href={`/profile/${cat}`}
                                             className="btn btn-primary btn-sm"
                                          >
                                             <strong>View</strong>
                                          </Link>
                                          &ensp;
                                          <Link
                                             href={`/redoWrong/${cat}`}
                                             className="btn btn-warning btn-sm"
                                          >
                                             <strong>Redo</strong>
                                          </Link>
                                       </td>
                                    )}
                                 </tr>
                              ))}
                           </tbody>
                        </Table>
                  }
               </Accordion.Body>
            </Accordion.Item>
         </Accordion>

         <Button
            variant="danger"
            onClick={() => setShowCfmEraseData(true)}
            className="d-flex align-items-center mt-3"
         >
            <strong>Erase all data</strong>
         </Button>

         <Modal size="lg" centered
            show={showCfmEraseData}
            onHide={() => setShowCfmEraseData(false)}
            backdrop="static"
         >
            <Modal.Header><Modal.Title className="fs-5">Confirmation</Modal.Title></Modal.Header>
            <Modal.Body>
               <p className="text-center mb-3">
                  Do you really want to erase all your question answering data? This <strong>cannot</strong> be undone.
               </p>
               <div className="d-flex justify-content-center">
                  <div className="hstack gap-3">
                     <Button
                        variant="light"
                        onClick={async () => {
                           await eraseUserData(userData.name);
                           window.location.reload();
                        }}
                     >
                        Confirm Erase
                     </Button>
                     <Button
                        variant="danger"
                        onClick={() => setShowCfmEraseData(false)}
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
            </Modal.Body>
         </Modal>

         <p className="text-light" style={{marginTop: "60px"}}>{JSON.stringify(userData)}</p>
      </>
   );
}
