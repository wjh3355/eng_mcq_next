"use client";

import { Container, Button } from "react-bootstrap";
import { useEffect } from "react";

export default function Error({ error, reset }) {
   useEffect(() => {
      console.error(error);
   }, [error]);

   return (
      <Container className="mt-3 text-center">
         <h4>Something went wrong.</h4>
         <Button
            variant="primary"
            onClick={() => reset()}
         >
            Try again
         </Button>
      </Container>
   );
}
