"use client";

import { useState } from "react";

import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Modal from "react-bootstrap/Modal";
import Popover from "react-bootstrap/Popover";
import Accordion from "react-bootstrap/Accordion";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

import { QnCategory, QnCategoryUserData, UserData } from "@/types";
import { QN_CATEGORIES_DATA } from "@/types";
import Link from "next/link";
import eraseUserData from "@/serverFuncs/eraseUserData";
import { Info, Trash2 } from "lucide-react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

export default function UserStatsTable({ 
   userData,
   kindeUser
}: { 
   userData: UserData,
   kindeUser: KindeUser<Record<string, any>> 
}) {

   const [showCfmEraseData, setShowCfmEraseData] = useState<boolean>(false);

   return (
      <Container>
         <dl className="row">
            <dt className="col-sm-3">Username</dt>
            <dd className="col-sm-9">{kindeUser.given_name}</dd>

            <dt className="col-sm-3">Email address</dt>
            <dd className="col-sm-9">{kindeUser.email}</dd>

            <dt className="col-sm-3">Date created</dt>
            <dd className="col-sm-9">{userData.dateCreated.toDateString()}</dd>

            <dt className="col-sm-3">Total points</dt>
            <dd className="col-sm-9">
               {userData.score}
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
                  <button className="border-0 bg-transparent p-0 ms-1">
                     <Info size={17} strokeWidth={3} color="#808080" />
                  </button>
               </OverlayTrigger>
            </dd>
         </dl>

         <Row>
            <Col xl={8} lg={10} className="mx-auto">
               <Accordion>
                  <Accordion.Item eventKey="0">
                     <Accordion.Header><strong>Cloze</strong></Accordion.Header>
                     <Accordion.Body>
                        {
                           userData.clozeData.length === 0
                           ? "You have not attempted any cloze questions yet!"
                           : <ul>
                              {
                                 userData.clozeData.map(({qnNum, correctAns}) => 
                                    <li key={qnNum}>
                                       {`Cloze ${qnNum}: ${correctAns.length} / 15 correct`}
                                    </li>
                                 )
                              }
                           </ul>
                        }
                     </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                     <Accordion.Header><strong>MCQ Questions</strong></Accordion.Header>
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
                                    {(Object.entries(userData.qnData) as [ QnCategory, QnCategoryUserData ][])
                                       .map(([cat, { numQnsAttempted, wrongQnNums }]) => (
                                       <tr key={cat}>
                                          <td>{QN_CATEGORIES_DATA[cat].categoryName}</td>
                                          <td>{numQnsAttempted}</td>
                                          <td>{wrongQnNums.length}</td>
                                          {wrongQnNums.length === 0 
                                             ?  <td />
                                             :  <td>
                                                <Link
                                                   href={`/profile/wrongmcq/${cat}`}
                                                   className="btn btn-primary btn-sm px-3"
                                                >
                                                   <strong>View</strong>
                                                </Link>
                                             </td>
                                          }
                                       </tr>
                                    ))}
                                 </tbody>
                              </Table>
                        }
                     </Accordion.Body>
                  </Accordion.Item>
               </Accordion>
            </Col>
         </Row>

         <Button
            variant="danger"
            onClick={() => setShowCfmEraseData(true)}
            className="d-flex align-items-center mt-3 mx-auto px-4"
         >
            <Trash2 className="me-1"/><strong>Erase all data</strong>
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

         <p className="text-light" style={{color: "rgb(255, 255, 255)", fontSize: "2px"}}>{JSON.stringify(userData)}</p>
      
      </Container>
   );
}
