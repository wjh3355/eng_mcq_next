'use client';

import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import Link from "next/link";
import React from "react";

export default function MainNavbar() {

   const gepMcqLinks = [
      {
         name: "Set 1",
         href: "/gep_mcq/set1" 
      },
      {
         name: "Set 2",
         href: "/gep_mcq/set2" 
      },
      {
         name: "Set 3",
         href: "/gep_mcq/set3" 
      },
      {
         name: "Set 4",
         href: "/gep_mcq/set4" 
      },
      {
         name: "Set 5",
         href: "/gep_mcq/set5" 
      },
      {
         name: "Set 6",
         href: "/gep_mcq/set6"
      },
      {
         name: "Complete",
         href: "/gep_mcq/complete"
      },
   ];

   function showGepMcqLink(link, idx) {
      const { name, href } = link;
      return (
         <React.Fragment key={name}>
            {idx === 6 && <NavDropdown.Divider />}
            <NavDropdown.Item href={href}>{name}</NavDropdown.Item>
         </React.Fragment>
      );
   }

   return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} href="/">
               English Tutor
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link as={Link} href="/about">
                     About
                  </Nav.Link>

                  <NavDropdown title="GEP MCQ">
                     {gepMcqLinks.map(showGepMcqLink)}
                  </NavDropdown>
               </Nav>

               <Navbar.Text>
                  Signed in as: <strong>John Doe</strong>
               </Navbar.Text>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}