'use client';

import React from "react";
import { Navbar, Container, Nav, NavDropdown, Button, Spinner } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";


// #####################################################################


export default function MainNavbar() {
   const { isAuthenticated } = useKindeBrowserClient();

   return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} href="/">
               Sunbird English
            </Navbar.Brand>

            <Navbar.Toggle/>

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">
                  <Nav.Link as={Link} href="/">
                     Home
                  </Nav.Link>

                  <Nav.Link as={Link} href="/about">
                     About
                  </Nav.Link>

                  {isAuthenticated && <GEP_VOCAB_navLinks/>}

                  {isAuthenticated && <PHRASAL_VERBS_navLinks/>}
                  
               </Nav>

               <DisplayEmailAndLogInOrLogOut/>

            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

function GEP_VOCAB_navLinks() {
   const GEP_VOCAB_navLinksArray = [
      {
         name: "Set 1",
         href: "/gep_vocab/set1" 
      },
      {
         name: "Set 2",
         href: "/gep_vocab/set2"
      },
      {
         name: "Set 3",
         href: "/gep_vocab/set3"
      },
      {
         name: "Set 4",
         href: "/gep_vocab/set4"
      },
      {
         name: "Set 5",
         href: "/gep_vocab/set5"
      },
      {
         name: "Set 6",
         href: "/gep_vocab/set6"
      },
      {
         name: "Complete",
         href: "/gep_vocab"
      },
   ];

   const currPathname = usePathname();

   return (
      <NavDropdown title="GEP Vocab">
      {
         GEP_VOCAB_navLinksArray.map(({ name, href }, idx) => 

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

function PHRASAL_VERBS_navLinks() {

   const PHRASAL_VERBS_navLinksArray = [
      {
         name: "Set 1",
         href: "/phrasal_verbs/set1" 
      },
      {
         name: "Set 2",
         href: "/phrasal_verbs/set2"
      },
      {
         name: "Complete",
         href: "/phrasal_verbs"
      },
   ];

   const currPathname = usePathname();

   return (
      <NavDropdown title="Phrasal Verbs">
      {
         PHRASAL_VERBS_navLinksArray.map(({ name, href }, idx) => 

         <React.Fragment key={name}>
            {idx === 2 && <NavDropdown.Divider />}
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
   )
}

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
                  width: '80px',
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
                  width: '80px',
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
                  width: "80px",
                  height: "30px",
               }}
            >
               Log In
            </LoginLink>
         </div>
      );
   }
};