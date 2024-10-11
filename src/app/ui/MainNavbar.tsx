'use client';

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Link from "next/link";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import DropdownLinksWithIndicator from "./components/DropdownLinksWithIndicator";
import qnCategoriesData from "@/lib/data";
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
            sets={qnCategoriesData.gep.sets}
         />

         <DropdownLinksWithIndicator
            title="Phrasal Verbs"
            sets={qnCategoriesData.phrasalVerbs.sets}
         />

         <NavDropdown title="PSLE Words">
            <DropdownLinksWithIndicator
               title="Cloze"
               sets={qnCategoriesData.psleWordsCloze.sets}
               dropEnd
            />

            <NavDropdown.Divider />

            <DropdownLinksWithIndicator
               title="MCQ"
               sets={qnCategoriesData.psleWordsMcq.sets}
               dropEnd
            />
         </NavDropdown>

         <NavDropdown title="PSLE Phrases">
            <DropdownLinksWithIndicator
               title="Cloze"
               sets={qnCategoriesData.pslePhrasesCloze.sets}
               dropEnd
            />
         </NavDropdown>
      </>
   );
}