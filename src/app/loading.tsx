import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";

export default function Loading() {
   return (
      <Container className="text-center">
         <h5 className="my-3">Loading...</h5>
         <Spinner animation="border"/>
      </Container>
   );
}