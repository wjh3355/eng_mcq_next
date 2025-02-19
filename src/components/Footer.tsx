import Link from "next/link";
import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function Footer() {
   return (
      <footer className="container-fluid bg-light py-3 mt-auto" style={{fontSize: "13px"}}>
         <Row>
            <Col md={4} className="mb-3">
               <h6>About Us</h6>
               <p className="text-secondary m-0">
                  An interactive english learning website for 🇸🇬 Singapore 🧑‍🎓 primary school students.
               </p>
            </Col>
            <Col md={4} className="mb-3">
               <h6>Quick Links</h6>
               <ul className="list-unstyled text-secondary m-0">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/profile">Profile</Link></li>
               </ul>
            </Col>
            <Col md={4} className="mb-3">
               <h6>Contact Info</h6>
               <ul className="list-unstyled text-secondary m-0">
                  Email: <Link href="mailto:contact@sunbirdenglish.com">contact@sunbirdenglish.com</Link>
               </ul>
            </Col>
         </Row>
         <Row>
            <Col className="text-center">
               <p className="text-secondary m-0">
                  &copy; {new Date().getFullYear()} Sunbird English. All
                  rights reserved.
               </p>
            </Col>
         </Row>
      </footer>
   );
};