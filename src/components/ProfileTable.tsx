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

import {
   McqCategory,
   McqCategoryUserData,
   QN_CATEGORIES_DATA,
} from "@/definitions";
import Link from "next/link";
import { Info, Trash2 } from "lucide-react";

import { sum } from "lodash";
import { UserProfileDocument } from "@/definitions";
import { DateTime } from "luxon";
import { resetUserData } from "@/lib/mongodb/user-server-actions";
import toast from "react-hot-toast";

export default function ProfileTable({ user }: { user: UserProfileDocument }) {

   const { qnData, clozeData, spellingData, score, email, dateCreated } = user;

   const [showCfmEraseData, setShowCfmEraseData] = useState<boolean>(false);

   function McqStats() {
      if (JSON.stringify(qnData) === "{}") {
         return <p>You have not attempted any MCQ questions yet!</p>;
      }

      const dataAsArr = Object.entries(qnData) as [
         McqCategory,
         McqCategoryUserData
      ][];

      const totalAttempted = sum(
         dataAsArr.map(([_, dat]) => dat.numQnsAttempted)
      );
      const totalWrong = sum(
         dataAsArr.map(([_, dat]) => dat.wrongQnNums.length)
      );
      const totalCorrect = totalAttempted - totalWrong;
      const totalPercentCorrect = Math.round(
         (totalCorrect * 100) / totalAttempted
      );

      return (
         <>
            <Table striped>
               <thead>
                  <tr>
                     <th>Category</th>
                     <th>No. Correct</th>
                     <th>No. Attempted</th>
                     <th>View Incorrect</th>
                  </tr>
               </thead>
               <tbody>
                  {dataAsArr.map(([cat, { numQnsAttempted, wrongQnNums }]) => (
                     <tr key={cat}>
                        <td>{QN_CATEGORIES_DATA[cat].categoryName}</td>
                        <td>{numQnsAttempted - wrongQnNums.length}</td>
                        <td>{numQnsAttempted}</td>
                        <td>
                           <Link
                              href={`/profile/wrongmcq/${cat}`}
                              className={
                                 "fw-bold btn btn-primary btn-sm px-3 " +
                                 (wrongQnNums.length === 0 ? "disabled" : "")
                              }
                           >
                              View
                           </Link>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </Table>

            <div className="text-center">
               Overall score:&nbsp;
               <strong>
                  {totalCorrect} / {totalAttempted} ({totalPercentCorrect}%)
               </strong>
            </div>
         </>
      );
   }

   function ClozeStats() {
      if (clozeData.length === 0) {
         return <p>You have not attempted any Cloze questions yet!</p>;
      }

      return (
         <Table striped>
            <thead>
               <tr>
                  <th>Cloze No.</th>
                  <th>Score</th>
                  <th>View Cloze</th>
               </tr>
            </thead>
            <tbody>
               {clozeData.map(({ qnNum, correctAns }) => (
                  <tr key={qnNum}>
                     <td>{`Q${qnNum}`}</td>
                     <td>{`${correctAns.length} / 15`}</td>
                     <td>
                        <Link
                           href={`/cloze/${qnNum}`}
                           className="btn btn-primary btn-sm px-3 fw-bold"
                        >
                           View
                        </Link>
                     </td>
                  </tr>
               ))}
            </tbody>
         </Table>
      );
   }

   function SpellingStats() {
      if (!("numQnsAttempted" in spellingData)) {
         return <p>You have not attempted any spelling questions yet!</p>;
      }

      const { numQnsAttempted, wrongQnNums } = spellingData;
 
      return (
         <Table striped>
            <thead>
               <tr>
                  <th>No. Correct</th>
                  <th>No. Attempted</th>
                  <th>View Incorrect</th>
               </tr>
            </thead>
            <tbody>
               <tr>
                  <td>{numQnsAttempted - wrongQnNums.length}</td>
                  <td>{numQnsAttempted}</td>
                  <td>Coming soon...</td>
               </tr>
            </tbody>
         </Table>
      )
   }

   return (
      <Container>
         <dl className="row">
            <dt className="col-sm-3">Email address</dt>
            <dd className="col-sm-9">{email}</dd>

            <dt className="col-sm-3">Date created</dt>
            <dd className="col-sm-9">
               {DateTime.fromISO(dateCreated).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}
            </dd>

            <dt className="col-sm-3">Total points</dt>
            <dd className="col-sm-9">
               {score}
               <OverlayTrigger
                  overlay={
                     <Popover>
                        <Popover.Body className="fs-6">
                           Every correct MCQ question answered earns you{" "}
                           <strong>10</strong> points.
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
               <Accordion alwaysOpen className="shadow-lg">
                  <Accordion.Item eventKey="0">
                     <Accordion.Header>
                        <strong>Cloze</strong>
                     </Accordion.Header>
                     <Accordion.Body>
                        <ClozeStats />
                     </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="1">
                     <Accordion.Header>
                        <strong>MCQ Questions</strong>
                     </Accordion.Header>
                     <Accordion.Body>
                        <McqStats />
                     </Accordion.Body>
                  </Accordion.Item>
                  <Accordion.Item eventKey="2">
                     <Accordion.Header>
                        <strong>Spelling Questions</strong>
                     </Accordion.Header>
                     <Accordion.Body>
                        <SpellingStats />
                     </Accordion.Body>
                  </Accordion.Item>
               </Accordion>
            </Col>
         </Row>

         <div className="hstack gap-3 d-flex justify-content-center mt-3">
            <Button
               variant="danger"
               onClick={() => setShowCfmEraseData(true)}
               className="d-flex align-items-center px-4"
            >
               <Trash2 className="me-1" />
               <strong>Erase all data</strong>
            </Button>
            {/* TODO: implement this */}
            {/* <Link
               className="btn btn-warning d-flex align-items-center px-4"
               href="/profile/changePassword"
            >
               <strong>Change Password</strong>
            </Link> */}
         </div>

         <Modal
            size="lg"
            centered
            show={showCfmEraseData}
            onHide={() => setShowCfmEraseData(false)}
            backdrop="static"
         >
            <Modal.Header>
               <Modal.Title className="fs-5">Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>

               <p className="text-center mb-3">
                  Do you really want to erase all your question answering data?
                  This <strong>cannot</strong> be undone!
               </p>

               <div className="d-flex justify-content-center">
                  <div className="hstack gap-3">
                     <Button
                        variant="light"
                        onClick={() => {
                           resetUserData(email)
                              .then(res => {
                                 setShowCfmEraseData(false);
                                 if (res.error) {
                                    toast.error(res.error);
                                 } else {
                                    toast.success("Your data has been erased.");
                                 }
                              })
                              .catch(() => toast.error("Failed to erase your data. Please try again later."));
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

         <p
            className="text-light"
            style={{ color: "rgb(255, 255, 255)", fontSize: "10px" }}
         >
            {JSON.stringify(user)}
         </p>
      </Container>
   );
}
