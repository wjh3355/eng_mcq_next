"use client";

import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import { useEffect } from "react";

export default function Error({
   error,
   reset,
}: {
   error: Error & { digest?: string };
   reset: () => void;
}) {
   
   useEffect(() => {
      console.error(error);
   }, [error]);

   return (
      <Container className="mt-3 text-center">
         <h4>Something went wrong!</h4>
         <Button 
            variant="primary" 
            className="my-3"
            size="lg"
            onClick={() => reset()}
         >
            Reload website
         </Button>
         <p>If this error persists, contact the administrator.</p>
         <p>Code: {error.digest || "none"}</p>
      </Container>
   );
}
