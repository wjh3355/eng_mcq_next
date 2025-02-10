'use client';

import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";

import Link from "next/link";

import "@/styles/global.css";

import { useSession } from "next-auth/react";
import { signOut, signIn } from "next-auth/react";
import React from "react";
import Spinner from "react-bootstrap/esm/Spinner";

export default function MainNavbar() {
   const { data: session } = useSession();

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
                  {session && 
                     <Nav>
                        <Nav.Link as={Link} href="/mcq">MCQ Questions</Nav.Link>
                        <Nav.Link as={Link} href="/cloze">Cloze Passages</Nav.Link>
                        <Nav.Link as={Link} href="/profile">Profile</Nav.Link>
                        {session.user.role === "admin" &&
                           <Nav.Link as={Link} href="/admin" className="text-danger">Admin</Nav.Link>
                        }
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
   "use client";
   
   const { data: session, status } = useSession();

   if (status === "loading") {
      return (
         <button className="btn btn-danger btn-sm acctBtn ms-lg-2 d-flex justify-content-center align-items-center" disabled>
            <Spinner size="sm" />
         </button>
      )
   }

   if (session) {
      return (
         <>
            <Navbar.Text>
               Welcome,&nbsp;<strong>{session.user?.email!}</strong>
            </Navbar.Text>
            <button className="btn btn-danger btn-sm acctBtn ms-lg-2" onClick={() => signOut()}>
               Log Out
            </button>
         </>
      );
   } else {
      return (
         <button className="btn btn-danger btn-sm acctBtn ms-lg-2" onClick={() => signIn()}>
            Log In
         </button>
      );
   }
}

