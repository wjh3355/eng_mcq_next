'use client';

import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";

import Link from "next/link";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import AccountButton from "@/app/ui/components/AccountButton";

export default function MainNavbar() {
   const { isAuthenticated } = useKindeBrowserClient();

   return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark">
         <Container fluid>
            <Navbar.Brand as={Link} href="/" className="customFont">
               Sunbird English
            </Navbar.Brand>

            <Navbar.Toggle />

            <Navbar.Collapse>

               <Nav className="me-auto">

                  {isAuthenticated && 
                     <>
                        <Nav.Link as={Link} href="/profile">
                           Profile
                        </Nav.Link>
                        
                        <Nav.Link as={Link} href="/questions">
                           Questions
                        </Nav.Link>

                        {/* <Nav.Link as={Link} href="/redoWrong">
                           Reattempt
                        </Nav.Link> */}
                     </>
                  }

               </Nav>

               <AccountButton/>
               
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};