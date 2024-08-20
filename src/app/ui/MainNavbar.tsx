'use client';

import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import MakeDropDownNavLinks from "./utils/MakeDropDownNavLinks";
import { GEP_VOCAB_navLinksArray, PHRASAL_VERBS_navLinksArray } from "@/lib/data";
import DisplayEmailAndLogInOrLogOut from "./utils/DisplayEmailAndLogInOrLogOut";


// #####################################################################


export default function MainNavbar() {
   const { isAuthenticated } = useKindeBrowserClient();

   return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} href="/">
               Sunbird English
            </Navbar.Brand>

            <Navbar.Toggle />

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">

                  <Nav.Link as={Link} href="/">
                     Home
                  </Nav.Link>

                  <Nav.Link as={Link} href="/about">
                     About
                  </Nav.Link>

                  {isAuthenticated && (
                     <MakeDropDownNavLinks
                        title="GEP Vocab"
                        linksArray={GEP_VOCAB_navLinksArray}
                     />
                  )}

                  {isAuthenticated && (
                     <MakeDropDownNavLinks
                        title="Phrasal Verbs"
                        linksArray={PHRASAL_VERBS_navLinksArray}
                     />
                  )}

               </Nav>

               <DisplayEmailAndLogInOrLogOut/>
               
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};