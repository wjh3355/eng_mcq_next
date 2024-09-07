'use client';

import { GenericMCQContextValueType } from '@/lib/types';
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

export default function GenericErrorContainer({ 
   QnContextToUse 
}: {
   QnContextToUse: () => GenericMCQContextValueType
}) {

   const { error } = QnContextToUse();

   if (!error) return;

   return (
      <Col>
         <Alert variant="danger" dismissible>
            🚫 <strong>Error: </strong>{error}.
         </Alert>
      </Col>
   );
}