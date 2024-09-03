import { NavLinksArrayType } from "@/lib/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavDropdown from "react-bootstrap/NavDropdown";
import React from "react";

export default function DropdownLinksWithIndicator({
   title,
   linksArray
}: {
   title: string,
   linksArray: NavLinksArrayType
}) {
   
   const currPathname = usePathname();
   return (
      <NavDropdown title={title}>
      {
         linksArray.map(({ name, href }, idx) =>
         <React.Fragment key={name}>
            {(idx === linksArray.length - 1) && <NavDropdown.Divider />}
            <NavDropdown.Item
               as={Link}
               href={href}
               className={currPathname === href ? 'fw-bold' : ''}
            >
               {currPathname === href ? '> ' : ''} {name}
            </NavDropdown.Item>
         </React.Fragment>
         )
      }
      </NavDropdown>
   );
}