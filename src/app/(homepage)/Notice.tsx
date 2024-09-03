'use client';

import Card from "react-bootstrap/Card";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function Notice() {
   const { isAuthenticated } = useKindeBrowserClient();

   if (!isAuthenticated) return null;

   return (
      <Card
         border={'primary'}
      >
         <Card.Header>
            Notice
         </Card.Header>

         <Card.Body>

            <Card.Text>
               The <strong>Set 2</strong> and <strong>Complete</strong> question categories under <strong>PSLE Words Cloze</strong> are not functional at the moment. Please use only <strong>Set 1.</strong>
            </Card.Text>
         </Card.Body>

      </Card>
   );
}