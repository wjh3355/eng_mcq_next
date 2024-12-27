import React from "react";
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
   return (
      <footer className="bg-light py-4 mt-5">
         <Container>
            <Row>
               <Col md={6}>
                  <h5>About Us</h5>
                  <p>
                     Your company description goes here. Add a brief overview of
                     your services or mission.
                  </p>
               </Col>
               {/* <Col md={6}>
                  <h5>Quick Links</h5>
                  <ul className="list-unstyled">
                     <li>
                        <a href="/" className="text-light">
                           Home
                        </a>
                     </li>
                     <li>
                        <a href="/services" className="text-light">
                           Services
                        </a>
                     </li>
                     <li>
                        <a href="/contact" className="text-light">
                           Contact
                        </a>
                     </li>
                     <li>
                        <a href="/privacy" className="text-light">
                           Privacy Policy
                        </a>
                     </li>
                  </ul>
               </Col> */}
               <Col md={6}>
                  <h5>Contact Info</h5>
                  <ul className="list-unstyled">
                     <li>Email: sunbirdenglish@gmail.com</li>
                  </ul>
               </Col>
            </Row>
            <Row className="mt-3">
               <Col className="text-center">
                  <p className="mb-0">
                     &copy; {new Date().getFullYear()} Sunbird English. All
                     rights reserved.
                  </p>
               </Col>
            </Row>
         </Container>
      </footer>
   );
};