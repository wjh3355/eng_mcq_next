'use client';

import { Navbar, Container, Nav, NavDropdown, Button, Spinner } from "react-bootstrap";
import Link from "next/link";
import React from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { usePathname } from "next/navigation";

export default function MainNavbar() {
   const { isAuthenticated } = useKindeBrowserClient();

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

                  {isAuthenticated && <GepMcqLinks/>}
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

   const currPathname = usePathname();

   return (
      <NavDropdown title="GEP MCQ">
      {
         gepMcqLinksArr.map(({ name, href }, idx) => 
            <React.Fragment key={name}>
               {idx === 6 && <NavDropdown.Divider />}
               <NavDropdown.Item 
                  as={Link} 
                  href={href}
                  className={currPathname === href ? 'fw-bold' : ''}
               >
                  {currPathname === href ? '> ' : ''}
                  {name}
               </NavDropdown.Item>
            </React.Fragment>
         )
      }
      </NavDropdown>
   );
};

function DisplayEmailAndLogInOrLogOut() {
   const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

   if (isLoading) {
      return (
         <div>
            <Button
               disabled
               variant="danger"
               size="sm"
               className="btn btn-danger btn-sm ms-2 align-items-center justify-content-center d-flex"
               style={{
                  width: '70px',
                  height: '30px'
               }}
            >
               <Spinner animation="border" size="sm" />
            </Button>
         </div>
      );
   }

   if (isAuthenticated) {
      return (
         <div className="d-flex align-items-center">
            <Navbar.Text>
               Welcome,&nbsp;
               <strong>{user?.given_name}</strong>
            </Navbar.Text>
            <LogoutLink
               className="btn btn-danger btn-sm ms-2 align-items-center justify-content-center d-flex"
               style={{
                  width: '70px',
                  height: '30px'
               }}
            >
               Log Out
            </LogoutLink>
         </div>
      );
   } else {
      return (
         <div>
            <LoginLink
               className="btn btn-danger btn-sm align-items-center justify-content-center d-flex"
               style={{
                  width: "70px",
                  height: "30px",
               }}
            >
               Log In
            </LoginLink>
         </div>
      );
   }
}

