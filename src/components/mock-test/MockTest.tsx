import { Cloze, Collections, Question } from "@/definitions";
import { fetchCloze } from "@/lib/mongodb/cloze-server-actions";
import { fetchQuestion } from "@/lib/mongodb/question-server-actions";
import MTClientComponent from "./MTClientComponent";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

type MockTestProps = {
   questions: Partial<Record<Collections, number[]>>
   clozeNum: number;
}

export default async function MockTest({
   questions,
   clozeNum,
   mockTestNum,
}: {
   questions: Partial<Record<Collections, number[]>>
   clozeNum: number;
   mockTestNum: number;
}) {

   let questionObjsArray: Question[] = [];
   let clozeObj: Cloze | { error: string } = { error: "Cloze not found" };

   for (const [collection, qnNums] of Object.entries(questions) as [Collections, number[]][]) {
      const questionsInThisCollection = await fetchQuestion(collection, ...qnNums);
      if ("error" in questionsInThisCollection) {
         throw new Error(questionsInThisCollection.error);
      }
      questionObjsArray.push(...questionsInThisCollection);
   }

   if (clozeNum) {
      clozeObj = await fetchCloze(clozeNum);
   }
   
   if ("error" in clozeObj) {
      throw new Error(clozeObj.error);
   }

   return (
      <Container>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">Mock Test {mockTestNum}</h5>
            </Col>
         </Row>
         <MTClientComponent
            questions={questionObjsArray}
            cloze={clozeObj}
         />
      </Container>
   )
}
