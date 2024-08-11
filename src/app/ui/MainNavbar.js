'use client';

import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import Link from "next/link";
import React from "react";

export default function MainNavbar() {
   return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} href="/">
               English Tutor
            </Navbar.Brand>

            <Navbar.Toggle/>

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link as={Link} href="/about">
                     About
                  </Nav.Link>

                  {true && <GepMcqLinks/>}
               </Nav>
                  <DisplayEmailAndLogInOrLogOut/>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

function GepMcqLinks() {
   const gepMcqLinksArr = [
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
         href: "/gep_mcq"
      },
   ];

   return (
      <NavDropdown title="GEP MCQ">
      {
         gepMcqLinksArr.map(({ name, href }, idx) => 
            <React.Fragment key={name}>
               {idx === 6 && <NavDropdown.Divider />}
               <NavDropdown.Item as={Link} href={href}>
                  {name}
               </NavDropdown.Item>
            </React.Fragment>
         )
      }
      </NavDropdown>
   );
};

function DisplayEmailAndLogInOrLogOut() {


   if (true) {
      return (
         <div className="d-flex align-items-center">
            <Navbar.Text>
               Signed in as:&nbsp;
               <strong>placeholder@email.com</strong>
            </Navbar.Text>
            <Button 
               variant="danger" 
               className="fw-bold ms-2"
               size="sm"
            >
               Log Out
            </Button>
         </div>
      );
   } else {
      return (
         <div>
            <Button 
               variant="danger" 
               className="fw-bold"
               size="sm"
            >
               Log In
            </Button>
         </div>
      );
   }
}

