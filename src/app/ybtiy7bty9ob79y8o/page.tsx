import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AIDictionary from "./AIDictionary";
import Image from "next/image";
import { checkNormalUserAuth } from "@/serverFuncs/checkUserAuth";

export const dynamic = 'force-dynamic';

export default async function Page() {

   await checkNormalUserAuth();

   return (
      <>
         <Row className="my-3">
            <Col>
               <h5 className="m-0 text-center">AI Dictionary</h5>
            </Col>
         </Row>
         <Row>
            <Col className="text-secondary text-center">
               <small>
                  Powered by 
                  <Image 
                     src="/gpt.png" 
                     alt="GPT logo" 
                     width={15} 
                     height={15}
                     className="mx-1"
                  /> 
                  GPT-4o-mini.
                  <br/>
                  This service is powered by an AI and may not be entirely accurate or appropriate. Please verify information independently.
               </small>
            </Col>
         </Row>
         <AIDictionary/>
      </>
   );
}