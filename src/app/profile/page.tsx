// import qnCategoriesData from "@/lib/data";
import { connectToDB } from "@/lib/connectToDB";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
// import fetchQnFromDB from "@/lib/fetchQnFromDB";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
// import ReviewSentenceFormatter from "../ui/components/ReviewSentenceFormatter";
import { UserDataType } from "@/lib/data";
import { UserDataSchema } from "@/lib/zod";

export default async function Page() {
   const { isAuthenticated, getUser } = getKindeServerSession();
   const isLoggedIn = await isAuthenticated();
   if (!isLoggedIn) redirect("/");

   const currUser = await getUser();
   const userData = await fetchWrongQns(currUser.given_name!);

   return (
      <Container>
         <Row className="my-3">
            <h5 className="text-center m-0">Your Profile</h5>
         </Row>

         <Row>
            <Col>
               <p>
                  <strong>Username: </strong>
                  {currUser.given_name}
               </p>
               <p>
                  <strong>Email address: </strong>
                  {currUser.email}
               </p>
            </Col>
         </Row>

         <Row>
            <Col>
               <table className="table table-striped">
                  <thead>
                     <tr>
                        <th>Question Category</th>
                        <th>No. Attempted</th>
                        <th>No. Incorrect</th>
                        {/* <th>Incorrect Questions</th> */}
                     </tr>
                  </thead>
                  <tbody>
                        {Object.entries(userData).map(
                           ([cat, dat]) => (
                              <tr key={cat}>
                                 <td>{cat}</td>
                                 <td>{dat.numQnsAttempted}</td>
                                 <td>{dat.wrongQnNums.length}</td>
                                 {/* <td>{dat.wrongQnNums.sort((a, b) => a - b).join(", ")}</td> */}
                              </tr>
                           )
                        )}
                  </tbody>
               </table>
            </Col>
         </Row>

      </Container>
   );
}

async function fetchWrongQns(name: string) {
   const { db } = await connectToDB("userDatas");
   const data = await db.collection("userQnData").findOne(
      { name },
      { projection: { _id: 0, name: 0 } }
   );

   if (!data) throw new Error("User data not found");

   const zodResult = UserDataSchema.safeParse(data);

   if (!zodResult.success) {
      console.error("Data not of correct type:", zodResult.error.issues);
      throw new Error("Type validation error");
   }

   return zodResult.data as UserDataType;
} 

// async function displayIncorrectQnCategory(category: string, qnNums: number[]) {
//    const col = Object
//       .values(qnCategoriesData)
//       .find(data => data.name === category)!
//       .mongoCollection;
   
//    return (
//       <Row key={category} className="mt-3">
//          <Col>
//             <div className="card">
//                <div className="card-header fw-bold">{category}</div>
//                <div className="card-body">
//                   <div className="card-text">
//                      {qnNums.map(async qnNum => await displayIncorrectQn(col, qnNum))}
//                   </div>
//                </div>
//             </div>
//          </Col>
//       </Row>
//    );
// }

// async function displayIncorrectQn(col: string, qnNum: number) {

//    const qnObj = await fetchQnFromDB(col, qnNum);

//    const { sentence, rootWord, wordToTest, def, correctAns } = qnObj;
//    return (
//       <div className="card card-body" key={rootWord}>
//          <ReviewSentenceFormatter
//             sentence={sentence}
//             wordToTest={wordToTest}
//             correctAns={correctAns}
//          />
//          <div className="d-flex justify-content-center mt-3">
//             <div
//                className="py-2 px-4 rounded-5 border-bottom border-2"
//                style={{ backgroundColor: "#ffe484" }}
//             >
//                <strong>{rootWord}</strong>: {def}.
//             </div>
//          </div>
//       </div>
//    );
// }