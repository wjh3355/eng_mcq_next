'use client';

import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Container from "react-bootstrap/Container";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import NavbarDropdownLinks from "./components/NavbarDropdownLinks";
import { GEP_VOCAB_navLinksArray, PHRASAL_VERBS_navLinksArray, PSLE_CLOZE_navLinksArray } from "@/lib/data";
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

            <Navbar.Collapse id="basic-navbar-nav">
               <Nav className="me-auto">

                  <ShowQnLinks_IfAuthenticated/>

                  {/* <NavDropdown title="outer dropdown">
                     <NavDropdown title="inner dropdown 1">
                        <NavDropdown.Item>
                           aaa
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                           bbb
                        </NavDropdown.Item>
                     </NavDropdown>
                     <NavDropdown.Divider/>
                     <NavDropdown title="inner dropdown 2">
                        <NavDropdown.Item>
                           ccc
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                           ddd
                        </NavDropdown.Item>
                     </NavDropdown>
                  </NavDropdown> */}

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
         <NavbarDropdownLinks
            title="GEP Vocab"
            linksArray={GEP_VOCAB_navLinksArray}
         />
         <NavbarDropdownLinks
            title="Phrasal Verbs"
            linksArray={PHRASAL_VERBS_navLinksArray}
         />
         <NavbarDropdownLinks
            title="PSLE Words Cloze"
            linksArray={PSLE_CLOZE_navLinksArray}
         />
      </>
   );
}