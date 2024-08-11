import { Container, Spinner } from "react-bootstrap";

export default function LoadingSpinner() {
   return (
      <Container className="mt-3">
         <div className="d-flex justify-content-center">
            <h4>Loading...</h4>
         </div>
         <div className="d-flex justify-content-center mt-3">
            <Spinner animation="border" variant="dark">
               <span className="visually-hidden">Loading...</span>
            </Spinner>
         </div>
      </Container>
   );
}