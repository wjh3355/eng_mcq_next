"use client";

import { QN_CATEGORIES_DATA, McqCategory, McqCategoryUserData, UserAuthDocument, UserProfileDocument } from "@/definitions";
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
         <Table striped="columns" responsive>
            <thead>
               <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Password (Encrypted)</th>
                  <th>Role</th>
                  <th>Date Created</th>
                  <th>Is Suspended?</th>
                  <th>MCQ Data</th>
                  <th>Cloze Data</th>
                  <th>Spelling Data</th>
                  <th>Points</th>
                  <th>Delete</th>
               </tr>
            </thead>
            <tbody>
               {allUsersArray.map((
                  [
                     { email, passwordHash, role, dateCreated, isSuspended }, 
                     {qnData, clozeData, spellingData, score}
                  ], idx) => {

                  const qnDataAsArr = Object.entries(qnData) as [ McqCategory, McqCategoryUserData ][];

                  return (
                     <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{email}</td>
                        <td>{passwordHash.slice(7, 20) + "..."}</td>
                        <td>
                           <span className={role === "admin" ? "text-primary fw-bold" : ""}>{role}</span>
                        </td>
                        <td>{DateTime.fromISO(dateCreated).toISODate()}</td>
                        <td>
                           <span className={isSuspended ? "text-danger fw-bold" : ""}>{isSuspended ? "Yes" : "No"}</span>
                           <Button 
                              variant={isSuspended ? "success" : "warning"} 
                              size="sm"
                              className="ms-3"
                              onClick={() => {
                                 toggleSuspend(email, !isSuspended)
                                    .then(res => {
                                       if (res.error) {
                                          toast.error(res.error);
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
                           {qnDataAsArr.map(([cat, { numQnsAttempted, wrongQnNums }]) =>
                              <p key={cat}>
                                 {`${QN_CATEGORIES_DATA[cat].categoryName}: ${numQnsAttempted - wrongQnNums.length} / ${numQnsAttempted}`}
                              </p>
                           )}
                        </td>
                        <td>
                           {clozeData.map(({qnNum, correctAns}) => 
                              <p key={qnNum}>
                                 {`Q${qnNum}: ${correctAns.length} / 15`}
                              </p>
                           )}
                        </td>
                        <td>
                           {"numQnsAttempted" in spellingData && 
                              `${spellingData.numQnsAttempted - spellingData.wrongQnNums.length} / ${spellingData.numQnsAttempted}`
                           }
                        </td>
                        <td>{score}</td>
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
                                    if (res.error) {
                                       toast.error(res.error);
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
