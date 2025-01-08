"use client";

import getAIDefinition from "@/utils/getAIDefinition";
import { AIDefinition } from "@/types/aiDefTypes";
import { useState } from "react";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const EMPTY_DEF: AIDefinition = {
   wordToDefine: null,
   definitions: [],
   errorIfAny: null
}

export default function AIDictionary() {

   const [wordToSearch, setWordToSearch] = useState<string>("");
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [responseObj, setResponseObj] = useState<AIDefinition>(EMPTY_DEF);
   const [error, setError] = useState<string>("");

   function handleInputUpdate(event: React.ChangeEvent<HTMLInputElement>) {
      setWordToSearch(event.target.value);
   }

   function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.key === "Enter") getAIDef();
   }

   async function getAIDef() {
      setIsLoading(true);
      setError("");

      try {
         setResponseObj(await getAIDefinition(wordToSearch.trim()));
      } catch (error) {
         if (error instanceof Error) {
            setError(error.message);
         }
      }

      setIsLoading(false);
   }

   return (
      <Row className="mt-3">
         <div className="d-flex justify-content-center">
            <input
               style={{ textAlign: "center", borderWidth: "3px" }}
               type="text"
               value={wordToSearch}
               onChange={handleInputUpdate}
               onKeyDown={handleKeyPress}
               placeholder="english word/phrase"
               disabled={isLoading}
            />
            <Button
               onClick={async () => getAIDef()}
               disabled={isLoading || wordToSearch.length === 0}
               className="ms-2"
               size="sm"
               style={{width: "120px"}}
            >
               {isLoading ? <Spinner size="sm"/> : "Get definition"}
            </Button>
         </div>

         <Col>
            {
               responseObj.wordToDefine !== null &&  
               <div className="mt-3">
                  <h5 className="mb-2 fw-bold">{responseObj.wordToDefine}</h5>
                  {responseObj.definitions.map((thisDef, idx) => 
                     <div key={idx}>
                        <ul>
                           <li>({thisDef.type}) {thisDef.def}</li>
                           <li className="fst-italic">{thisDef.sentence}</li>
                        </ul>
                     </div>
                  )}

                  {
                     responseObj.errorIfAny &&
                     <div className="text-danger">Error: {responseObj.errorIfAny}</div>
                  }
               </div>
            }
            {
               error &&
               <div className="text-danger">Error: {error}</div>
            }
         </Col>
      </Row>
   )
}