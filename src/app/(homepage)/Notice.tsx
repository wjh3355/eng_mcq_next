'use client';

import Card from "react-bootstrap/Card";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Notice() {
   const { isAuthenticated } = useKindeBrowserClient();

   if (!isAuthenticated) return null;

   return (
      <Card
         border="primary"
         className="mb-3"
      >
         <Card.Header>
            Notice
         </Card.Header>

         <Card.Body>

            <Card.Text>
               All question categories working normally.
            </Card.Text>
         </Card.Body>

      </Card>
   );
}