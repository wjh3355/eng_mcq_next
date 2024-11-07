'use client';

import { MCQContextValue } from '@/types';
import Alert from "react-bootstrap/Alert";
import { TriangleAlert } from 'lucide-react';

export default function GenericErrorContainer({ 
   QnContextToUse 
}: {
   QnContextToUse: () => MCQContextValue
}) {

   const { error } = QnContextToUse();

   if (!error) return;

   return (
      <Alert variant="danger" dismissible className="d-flex align-items-center">
         <TriangleAlert />&nbsp;<strong>Error: {error}</strong>
      </Alert>
   );
}