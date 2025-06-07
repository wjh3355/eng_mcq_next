"use client";

import { QnCollectionUserDat, UserAuthDocument, UserProfileDocument, Collections, QN_COL_DATA } from "@/definitions";
import { deleteUser, toggleSuspend } from "@/lib/mongodb/user-server-actions";
import { DateTime } from "luxon";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import Table from "react-bootstrap/esm/Table";
import toast from "react-hot-toast";

export default function UsersTable(
   { allUsersArray }: { allUsersArray: [UserAuthDocument, UserProfileDocument][] }
) {

   const [ showCfmDelete, setShowCfmDelete ] = useState(false);
   const [ userEmailToDelete, setUserEmailToDelete ] = useState<string | null>(null);

   return (
      <>
         <div style={{ overflowX: 'scroll', maxWidth: '100%', display: 'block', whiteSpace: 'nowrap' }}>
            <Table striped="columns" style={{ fontSize: "13px" }}>
               <thead>
                  <tr>
                     <th>#</th>
                     <th>Email</th>
                     <th>Password (Encrypted)</th>
                     <th>Role</th>
                     <th>Date Created</th>
                     <th>Questions Data</th>
                     <th>Cloze Data</th>
                     <th>Mock Test Data</th>
                     <th>Accumulated Points</th>
                     <th>Is Suspended?</th>
                     <th>Delete</th>
                  </tr>
               </thead>
               <tbody>
                  {allUsersArray.map((

                     [
                        { email, passwordHash, role, dateCreated, isSuspended }, 
                        { qnData, clozeData, mockTestData, score }
                     ],

                     idx) => {

                     const qnDataAsArr = Object.entries(qnData) as [ Collections, QnCollectionUserDat ][];

                     return (
                        <tr key={`user-${email}`}>
                           <td>{idx + 1}</td>
                           <td>{email}</td>
                           <td>{passwordHash.slice(7, 25) + "..."}</td>
                           <td>
                              <span className={role === "admin" ? "text-primary fw-bold" : ""}>{role}</span>
                           </td>
                           <td>{DateTime.fromISO(dateCreated).toISODate()}</td>
                           <td>
                              {qnDataAsArr.map(([cat, { numQnsAttempted, wrongQnNums }]) =>
                                 <div key={`user-${email}-questions-${cat}`}>
                                    {`${QN_COL_DATA[cat].categoryName}: ${numQnsAttempted - wrongQnNums.length} / ${numQnsAttempted}`}
                                 </div>
                              )}
                           </td>
                           <td>
                              {clozeData.sort((a, b) => a.qnNum - b.qnNum).map(({qnNum, correctAns}) => 
                                 <div key={`user-${email}-cloze-${qnNum}`}>
                                    {`Cloze ${qnNum}: ${correctAns.length} / 15`}
                                 </div>
                              )}
                           </td>
                           <td>
                              {mockTestData.sort((a, b) => a.mockTestNumber - b.mockTestNumber).map(({mockTestNumber, score, dateAttempted}) => 
                                 <div key={`user-${email}-mocktest-${mockTestNumber}`}>
                                    {`Mock Test ${mockTestNumber}: ${score} / 47 ${dateAttempted ? "(" + dateAttempted.toLocaleDateString() + ")" : ""}`}
                                 </div>
                              )}
                           </td>
                           <td>{score}</td>
                           <td>
                              <span className={isSuspended ? "text-danger fw-bold" : ""}>{isSuspended ? "Yes" : "No"}</span>
                              <Button 
                                 variant={isSuspended ? "success" : "warning"} 
                                 size="sm"
                                 className="ms-3"
                                 onClick={() => {
                                    toggleSuspend(email, !isSuspended)
                                       .then(res => {
                                          if (res.error!) {
                                             toast.error(res.error!);
                                          } else {
                                             toast.success(`User ${isSuspended ? "unsuspended" : "suspended"} successfully`)
                                          }
                                       })
                                       .catch(err => toast.error(err instanceof Error ? err.message : "An error occurred."));
                                 }}
                              >
                                 {isSuspended ? "Unsuspend User" : "Suspend User"}
                              </Button>
                           </td>
                           <td>
                              <Button 
                                 variant="danger" 
                                 size="sm"
                                 onClick={() => {
                                    setShowCfmDelete(true);
                                    setUserEmailToDelete(email);
                                 }}
                              >Delete User</Button>
                           </td>
                        </tr>
                     );
                  })}
               </tbody>
            </Table>
         </div>
         
         <Modal
            size="lg"
            centered
            show={showCfmDelete}
            onHide={() => setShowCfmDelete(false)}
            backdrop="static"
         >
            <Modal.Header>
               <Modal.Title className="fs-5">Confirm Delete User</Modal.Title>
            </Modal.Header>
            <Modal.Body>

               <p className="text-center mb-3">
                  Do you really want to delete the user <u>{userEmailToDelete}</u>?
                  <br/>
                  <strong className="text-danger">This cannot be undone!</strong>
                  <br/>
                  If he/she wishes to rejoin, a new invite is required.
               </p>

               <div className="d-flex justify-content-center">
                  <div className="hstack gap-3">

                     <Button
                        variant="light"
                        onClick={() => {
                           setShowCfmDelete(false);
                           setUserEmailToDelete(null);
                           if (userEmailToDelete) {
                              deleteUser(userEmailToDelete)
                                 .then(res => {
                                    if (res.error!) {
                                       toast.error(res.error!);
                                    } else {
                                       toast.success(`User ${userEmailToDelete} deleted successfully.`)
                                    }
                                 })
                                 .catch(err => toast.error(err instanceof Error ? err.message : "An error occurred."));
                           }
                        }}
                     >
                        Confirm Delete
                     </Button>

                     <Button
                        variant="danger"
                        onClick={() => {
                           setShowCfmDelete(false);
                           setUserEmailToDelete(null);
                           toast.error("User deletion cancelled.");
                        }}
                     >
                        Cancel
                     </Button>

                  </div>
               </div>

            </Modal.Body>
         </Modal>
      </>
   )
}
