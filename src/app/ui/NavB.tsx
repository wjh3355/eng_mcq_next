'use client';

import React from "react";

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import Spinner from "react-bootstrap/Spinner";

import "@/styles/global.css";

import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

import Link from "next/link";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function NavB() {
   const { isAuthenticated } = useKindeBrowserClient();

   return (
      <Navbar expand="lg" bg="light" data-bs-theme="light">
         <Container fluid>
            <Navbar.Brand as={Link} href="/" className="customFont">
               Sunbird English
            </Navbar.Brand>

            <Navbar.Toggle />

            <Navbar.Offcanvas placement={"end"}>

               <Offcanvas.Header closeButton>
                  <Offcanvas.Title>
                     Navigation
                  </Offcanvas.Title>
               </Offcanvas.Header>

               <Offcanvas.Body>
                  {isAuthenticated && 
                     <Nav>
                        <Nav.Link as={Link} href="/mcq">MCQ Questions</Nav.Link>
                        <Nav.Link as={Link} href="/cloze">Cloze</Nav.Link>
                        <Nav.Link as={Link} href="/profile">Profile</Nav.Link>
                     </Nav>
                  }
                  <Nav className="ms-auto">
                     <AccountButton/>
                  </Nav>
               </Offcanvas.Body>

            </Navbar.Offcanvas>
            
         </Container>
      </Navbar>
   );
};

function AccountButton() {
   const { user, isAuthenticated, isLoading } = useKindeBrowserClient();

   if (isLoading) {
      return (
         <div className="btn btn-danger btn-sm d-flex align-items-center justify-content-center disabled acctBtn">
            <Spinner animation="border" size="sm"/>
         </div>
      );
   }

   if (isAuthenticated) {
      return (
         <>
            <Navbar.Text className="me-lg-2">
               Welcome,&nbsp;<strong>{user?.given_name!}</strong>
            </Navbar.Text>
            <LogoutLink className="btn btn-danger btn-sm acctBtn">
               Log Out
            </LogoutLink>
         </>
      );
   } else {
      return (
         <LoginLink className="btn btn-danger btn-sm acctBtn">
            Log In
         </LoginLink>
      );
   }
};