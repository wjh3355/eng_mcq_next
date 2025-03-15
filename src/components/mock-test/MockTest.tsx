import { Cloze, Collections, MTDataType, Question } from "@/definitions";
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

   const {
      mockTestNumber,
      psleGrammar,
      psleWordsCloze,
      psleWordsMcq,
      phrasalVerbs,
      spelling,
      clozePassage,
   } = mockTestData;

   let questionObjsArray: Question[] = [];
   let clozeObj: Cloze | { error: string } = { error: "Cloze not found" };

   for (const [collection, qnNums] of Object.entries({
      psleGrammar,
      psleWordsCloze,
      psleWordsMcq,
      phrasalVerbs,
      spelling
   }) as [Collections, number[]][]) {
      const questionsInThisCollection = await fetchQuestion(collection, ...qnNums);
      if ("error" in questionsInThisCollection) {
         throw new Error(questionsInThisCollection.error);
      }
      questionObjsArray.push(...questionsInThisCollection);
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
            questions={questionObjsArray}
            cloze={clozeObj}
         />
      </Container>
   )
}
