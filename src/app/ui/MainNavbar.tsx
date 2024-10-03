'use client';

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Link from "next/link";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import DropdownLinksWithIndicator from "./components/DropdownLinksWithIndicator";
import { 
   GEP_VOCAB_navLinksArray, 
   PHRASAL_VERBS_navLinksArray,

   PSLE_WORDS_MCQ_navLinksArray,
   PSLE_WORDS_CLOZE_navLinksArray,
   
   PSLE_PHRASES_CLOZE_navLinksArray
} from "@/lib/navLinksArrays";
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
            linksArray={GEP_VOCAB_navLinksArray}
         />

         <DropdownLinksWithIndicator
            title="Phrasal Verbs"
            linksArray={PHRASAL_VERBS_navLinksArray}
         />

         <NavDropdown title="PSLE Words">
            <DropdownLinksWithIndicator
               title="Cloze"
               linksArray={PSLE_WORDS_CLOZE_navLinksArray}
               dropEnd
            />

            <NavDropdown.Divider />

            <DropdownLinksWithIndicator
               title="MCQ"
               linksArray={PSLE_WORDS_MCQ_navLinksArray}
               dropEnd
            />
         </NavDropdown>

         <NavDropdown title="PSLE Phrases">
            <DropdownLinksWithIndicator
               title="Cloze"
               linksArray={PSLE_PHRASES_CLOZE_navLinksArray}
               dropEnd
            />
         </NavDropdown>
      </>
   );
}