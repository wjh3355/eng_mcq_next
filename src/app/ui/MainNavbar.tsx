'use client';

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Link from "next/link";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import DropdownLinksWithIndicator from "./components/DropdownLinksWithIndicator";
import navLinksArrays from "@/lib/navLinksArrays";
import AccountButton from "./components/AccountButton";


// #####################################################################


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

   if (!isAuthenticated) return null;

   return (
      <>
         <DropdownLinksWithIndicator
            title="GEP Vocab"
            linksArray={navLinksArrays.gep}
         />

         <DropdownLinksWithIndicator
            title="Phrasal Verbs"
            linksArray={navLinksArrays.phrasal_verbs}
         />

         <NavDropdown title="PSLE Words">
            <DropdownLinksWithIndicator
               title="Cloze"
               linksArray={navLinksArrays.psle_words_cloze}
               dropEnd
            />

            <NavDropdown.Divider />

            <DropdownLinksWithIndicator
               title="MCQ"
               linksArray={navLinksArrays.psle_words_mcq}
               dropEnd
            />
         </NavDropdown>

         <NavDropdown title="PSLE Phrases">
            <DropdownLinksWithIndicator
               title="Cloze"
               linksArray={navLinksArrays.psle_phrases_cloze}
               dropEnd
            />
         </NavDropdown>
      </>
   );
}