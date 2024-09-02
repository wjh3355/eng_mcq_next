'use client';

import { GenericMCQContextValueType } from '@/lib/types';
import { Col, Alert } from "react-bootstrap";

export default function GenericErrorContainer({ 
   QnContextToUse 
}: {
   QnContextToUse: () => GenericMCQContextValueType
}) {

   const { error } = QnContextToUse();

   if (!error) return;

   return (
      <Col>
         <Alert variant="danger">
            🚫 Error: {error}. Please reload the page
         </Alert>
      </Col>
   );
}