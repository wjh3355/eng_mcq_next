import { Container, Alert } from "react-bootstrap";

export default function ErrorContainer({children}) {
   return (
      <Container className="mt-3 d-flex justify-content-center">
         <Alert variant="danger" className="w-75">
            <strong>{children}</strong>
         </Alert>
      </Container>
   );
}