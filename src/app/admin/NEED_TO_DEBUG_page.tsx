// import { QnCategory, QnCategoryUserData, QN_CATEGORIES_DATA } from "@/definitions";
// import { getAllUsersServer } from "@/lib/mongodb/get-user-server";
// import { DateTime } from "luxon";
// import Container from "react-bootstrap/esm/Container";
// import Row from "react-bootstrap/esm/Row";
// import Col from "react-bootstrap/esm/Col";
// import Table from "react-bootstrap/table";
// import { auth } from "@/auth";
// import { redirect } from "next/navigation";

// export default async function Admin_AllUsersPage() {

//    const session = await auth();
//    if (session?.user.role !== "admin") redirect("/");

//    const allUsersArray = await getAllUsersServer();

//    return (
//       <Container>

//          <Row className="my-3">
//             <Col>
//                <h5 className="m-0 text-center">All Users</h5>
//             </Col>
//          </Row>

//          <Table striped="columns" responsive>
//             <thead>
//                <tr>
//                   <th>#</th>
//                   <th>Email</th>
//                   <th>Hashed password</th>
//                   <th>Role</th>
//                   <th>Date Created</th>
//                   <th>Is Suspended?</th>
//                   <th>MCQ Data</th>
//                   <th>Cloze Data</th>
//                   <th>Points</th>
//                </tr>
//             </thead>
//             <tbody>
//                {allUsersArray.map(([{ email, passwordHash, role, dateCreated, isSuspended }, {qnData, clozeData, score}], idx) => {

//                   const qnDataAsArr = Object.entries(qnData) as [ QnCategory, QnCategoryUserData ][];

//                   return (
//                      <tr key={idx}>
//                         <td>{idx + 1}</td>
//                         <td>{email}</td>
//                         <td>{passwordHash.slice(7, 20) + "..."}</td>
//                         <td>
//                            <span className={role === "admin" ? "text-primary fw-bold" : ""}>{role}</span>
//                         </td>
//                         <td>{DateTime.fromISO(dateCreated).toISODate()}</td>
//                         <td>
//                            <span className={isSuspended ? "text-danger fw-bold" : ""}>{isSuspended ? "Yes" : "No"}</span>
//                         </td>
//                         <td>
//                            {qnDataAsArr.map(([cat, { numQnsAttempted, wrongQnNums }]) =>
//                               <p key={cat}>
//                                  {`${QN_CATEGORIES_DATA[cat].categoryName}: ${numQnsAttempted - wrongQnNums.length} / ${numQnsAttempted}`}
//                               </p>
//                            )}
//                         </td>
//                         <td>
//                            {clozeData.map(({qnNum, correctAns}) => 
//                               <p key={qnNum}>
//                                  {`Q${qnNum}: ${correctAns.length} / 15`}
//                               </p>
//                            )}
//                         </td>
//                         <td>{score}</td>
//                      </tr>
//                   );
//                })}
//             </tbody>
//          </Table>
//       </Container>
//    );
// }

function A() {
   return null;
}