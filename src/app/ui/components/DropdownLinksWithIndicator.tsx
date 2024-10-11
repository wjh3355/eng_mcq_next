import { usePathname } from "next/navigation";
import Link from "next/link";
import NavDropdown from "react-bootstrap/NavDropdown";
import React from "react";

export default function DropdownLinksWithIndicator({
   title,
   sets,
   dropEnd
}: {
   title: string,
   sets: Array<{
      name: string;
      href: string;
   }>,
   dropEnd?: boolean
}) {
   
   const currPathname = usePathname();

   return (
      <NavDropdown title={title} drop={dropEnd ? 'end' : 'down'}>
      {
         sets.map(({ name, href }) =>
            <React.Fragment key={name}>

               <NavDropdown.Item
                  as={Link}
                  href={href}
                  className={currPathname === href ? 'fw-bold' : ''}
               >

                  {name}
                  
               </NavDropdown.Item>

            </React.Fragment>
         )
      }
      </NavDropdown>
   );
}