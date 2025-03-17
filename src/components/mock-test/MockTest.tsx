import { Cloze, Collections, Question } from "@/definitions";
import { fetchCloze } from "@/lib/mongodb/cloze-server-actions";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";
import MTClientComponent from "./MTClientComponent";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { fetchMockTestData } from "@/lib/mongodb/mt-server-actions";

export default async function MockTest({ MTnum }: { MTnum: number }) {

   await new Promise(resolve => setTimeout(resolve, 1000));

   const mockTestData = await fetchMockTestData(MTnum);

   if ("error" in mockTestData) return;

   const { mockTestNumber, qnNums, clozePassage } = mockTestData;

   let qnsArray: Question[] = [];
   let clozeObj: Cloze | { error: string } = { error: "Cloze not found" };

   for (const [collection, collectionQnNums] of Object.entries(qnNums) as [Collections, number[]][]) {
      const qnsInThisCol = await fetchQuestion(collection, ...collectionQnNums);
      
      if ("error" in qnsInThisCol) {
         throw new Error(qnsInThisCol.error);
      }

      // collectionQnNums.forEach(qn => {
      //    if (!qnsInThisCol.some(qnObj => qnObj.qnNum === qn)) {
      //       console.log(`Question ${qn} was not found in ${collection}`);
      //    }
      // })

      qnsArray.push(...qnsInThisCol);
   }

   if (clozePassage) {
      clozeObj = await fetchCloze(clozePassage);
   }
   
   if ("error" in clozeObj) {
      throw new Error(clozeObj.error);
   }

   console.log(qnsArray);
   console.log(clozeObj);

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Mock Test {mockTestNumber}</h5>
            </Col>
         </Row>
         <MTClientComponent
            questions={qnsArray}
            cloze={clozeObj}
         />
      </Container>
   )
}
