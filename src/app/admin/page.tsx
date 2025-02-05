// "use client";

// import { QnCategory, QnCategoryUserData, QN_CATEGORIES_DATA } from "@/definitions";
// import Container from "react-bootstrap/esm/Container";
// import Table from "react-bootstrap/table";

// export default function Admin_AllUsersPage() {
   

//    return (
//       <Container>
//          <h1>aaaaaaaaa</h1>
//          <Table
//             striped
//             className="d-block"
//             style={{ overflowX: "auto", whiteSpace: "nowrap" }}
//          >
//             <thead>
//                <tr>
//                   <th>No.</th>
//                   <th>_id</th>
//                   <th>Email</th>
//                   <th>Is admin?</th>
//                   <th>Date created</th>
//                   <th>Question data</th>
//                   <th>Cloze data</th>
//                </tr>
//             </thead>
//             <tbody>
//                {allUsers.map(
//                   (
//                      {
//                         _id,
//                         email,
//                         isAdmin,
//                         dateCreated,
//                         qnData,
//                         clozeData,
//                      },
//                      idx
//                   ) => {

//                      const qnDataAsArr = Object.entries(qnData) as [ QnCategory, QnCategoryUserData ][];

//                      return (
//                         <tr key={idx}>
//                            <td>{idx + 1}</td>
//                            <td>{_id}</td>
//                            <td>{email}</td>
//                            <td>{isAdmin ? "Yes" : "No"}</td>
//                            <td>{dateCreated.toDateString()}</td>
//                            <td>
//                               {qnDataAsArr.map(([cat, { numQnsAttempted, wrongQnNums }]) =>
//                                  <p key={cat}>
//                                     {`${QN_CATEGORIES_DATA[cat].categoryName}: ${numQnsAttempted - wrongQnNums.length} / ${numQnsAttempted}`}
//                                  </p>
//                               )}
//                            </td>
//                            <td>
//                               {clozeData.map(({qnNum, correctAns}) => 
//                                  <p key={qnNum}>
//                                     {`Q${qnNum}: ${correctAns.length} / 15`}
//                                  </p>
//                               )}
//                            </td>
//                         </tr>
//                      );
//                   }
//                )}
//             </tbody>
//          </Table>
//       </Container>
//    );
// }
