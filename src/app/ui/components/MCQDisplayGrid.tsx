"use client";

import { QN_CATEGORIES_DATA } from "@/types";
import { QnCategory, QnSet } from "@/types";
import Link from "next/link";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

export default function MCQDisplayGrid() {
   return (
      <>
         {(Object.entries(QN_CATEGORIES_DATA) as [ QnCategory, { name: string, sets: QnSet[] } ][])
            .filter(([_, {name}]) => name !== "/Debug/" && name !== "Demo MCQ")
            .map(([cat, { name, sets }]) => 
               <Col key={cat} xl={3} lg={4} md={6} className="mb-3">
                  <Card className="h-100 bg-light">
                     <Card.Header>{name}</Card.Header>
                     <Card.Body>
                        <ul>
                           {sets.map(({ name: setName, href, qnNumRange }) => (
                              <li key={ setName } className={setName === "Random" ? "mt-2" : ""}>
                                 <Link href={href}>
                                    {
                                       setName === "Random"
                                       ?  `50 random questions`
                                       :  `${setName} (${qnNumRange[0]} to ${qnNumRange[1]-1})`
                                    }
                                 </Link>
                              </li>
                           ))}
                        </ul>
                     </Card.Body>
                  </Card>
               </Col>
         )}
      </>
   );
}