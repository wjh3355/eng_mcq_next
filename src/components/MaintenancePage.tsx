import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
   return (
      <Container
         fluid
         className="d-flex align-items-center justify-content-center vh-100 bg-light"
      >
         <Row className="justify-content-center">
            <Col xs={12} sm={10} md={8} lg={6}>
               <div className="card card-body text-center p-4 shadow-sm">
                  <div className="mb-3">
                     <Wrench size={48} className="text-primary" />
                  </div>

                  <h1 className="mb-4">Site Under Maintenance</h1>

                  <div className="mb-4">
                     We&apos;re currently performing scheduled maintenance to
                     improve your experience. We&apos;ll be back online shortly.
                  </div>

                  <div className="text-muted">
                     Estimated downtime: 2 hours
                  </div>
               </div>
            </Col>
         </Row>
      </Container>
   );
}
