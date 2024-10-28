'use client';

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Link from "next/link";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import DropdownLinksWithIndicator from "@/app/ui/components/DropdownLinksWithIndicator";
import { QN_CATEGORIES_DATA } from "@/types";
import AccountButton from "@/app/ui/components/AccountButton";

export default function MainNavbar() {
   return (
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" sticky="top">
         <Container>
            <Navbar.Brand as={Link} href="/">
               Sunbird English
            </Navbar.Brand>

            <Navbar.Toggle />

            <Navbar.Collapse>

               <Nav className="me-auto">

                  <ShowQnLinks_IfAuthenticated/>

               </Nav>

               <AccountButton/>
               
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
};

function ShowQnLinks_IfAuthenticated() {
   const { isAuthenticated } = useKindeBrowserClient();

   return isAuthenticated ? (
      <>
         <Nav.Link as={Link} href="/profile">
            Profile
         </Nav.Link>
         
         <DropdownLinksWithIndicator
            title="GEP Vocab"
            sets={QN_CATEGORIES_DATA.gep.sets}
         />

         <DropdownLinksWithIndicator
            title="Phrasal Verbs"
            sets={QN_CATEGORIES_DATA.phrasalVerbs.sets}
         />

         <NavDropdown title="PSLE Words">
            <DropdownLinksWithIndicator
               title="Cloze"
               sets={QN_CATEGORIES_DATA.psleWordsCloze.sets}
               dropEnd
            />

            <NavDropdown.Divider />

            <DropdownLinksWithIndicator
               title="MCQ"
               sets={QN_CATEGORIES_DATA.psleWordsMcq.sets}
               dropEnd
            />
         </NavDropdown>

         <NavDropdown title="PSLE Phrases">
            <DropdownLinksWithIndicator
               title="Cloze"
               sets={QN_CATEGORIES_DATA.pslePhrasesCloze.sets}
               dropEnd
            />
         </NavDropdown>
      </>
   ) : null;
}