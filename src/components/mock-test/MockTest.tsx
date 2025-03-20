import { Cloze, Collections, Question, UserProfileDocument } from "@/definitions";
import { fetchCloze } from "@/lib/mongodb/cloze-server-actions";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";
import MTClientComponent from "./MTClientComponent";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { fetchMockTestData } from "@/lib/mongodb/mt-server-actions";

export default async function MockTest({ MTnum, user }: { MTnum: number, user: UserProfileDocument }) {

   const mockTestData = await fetchMockTestData(MTnum);

   if ("error" in mockTestData) return;

   const { mockTestNumber, qnNums, clozePassage } = mockTestData;

   let questions: Partial<Record<Collections, Question[]>> = {};
   let clozeObj: Cloze | { error: string } = { error: "Cloze not found" };

   for (const [collection, collectionQnNums] of Object.entries(qnNums) as [Collections, number[]][]) {
      const qnsInThisCol = await fetchQuestion(collection, ...collectionQnNums);
      
      if ("error" in qnsInThisCol) {
         throw new Error(qnsInThisCol.error);
      } 

      questions[collection] = qnsInThisCol;
   }

   if (clozePassage) {
      clozeObj = await fetchCloze(clozePassage);
   }
   
   if ("error" in clozeObj) {
      throw new Error(clozeObj.error);
   }

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Mock Test {mockTestNumber}</h5>
            </Col>
         </Row>
         <MTClientComponent
            MTnum={MTnum}
            questions={questions}
            cloze={clozeObj}
            user={user}
         />
      </Container>
   )
}
