import Link from "next/link";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Footer() {
   return (
      <footer className="container-fluid bg-light py-4 mt-auto">
         <Row>
            <Col md={4} className="mb-4">
               <h6>About Us</h6>
               <p className="text-secondary">
                  Your company description goes here. Add a brief overview of
                  your services or mission.
               </p>
            </Col>
            <Col md={4} className="mb-4">
               <h6>Quick Links</h6>
               <ul className="list-unstyled text-secondary">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/profile">Profile</Link></li>
                  <li><Link href="/privacy">Privacy Policy</Link></li>
               </ul>
            </Col>
            <Col md={4} className="mb-4">
               <h6>Contact Info</h6>
               <ul className="list-unstyled text-secondary">
                  Email: <Link href="mailto:changxinshang@hotmail.com">changxinshang@hotmail.com</Link>
               </ul>
            </Col>
         </Row>
         <Row>
            <Col className="text-center">
               <p className="text-secondary">
                  &copy; {new Date().getFullYear()} Sunbird English. All
                  rights reserved.
               </p>
            </Col>
         </Row>
      </footer>
   );
};