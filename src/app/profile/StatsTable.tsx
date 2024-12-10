"use client";

import { useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { CurrentQnCategoriesTracked, UserData } from "@/types";
import { QN_CATEGORIES_DATA } from "@/types";
import Link from "next/link";
import eraseUserData from "@/serverFuncs/eraseUserData";

export default function StatsTable({ userData }: { userData: UserData }) {

   const [showCfmEraseData, setShowCfmEraseData] = useState<boolean>(false);

   return (
      <>
         <p>
            <strong>Total Score: </strong>
            {userData.score}
         </p>
         <section style={{ overflowX: "auto" }}>
            <Table striped>
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
         </section>

         <Button
            variant="danger"
            onClick={() => setShowCfmEraseData(true)}
            className="d-flex align-items-center"
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
      </>
   );
}
