import { NavLinksArrayType } from "@/lib/types";
import { usePathname } from "next/navigation";
import Link from "next/link";
import NavDropdown from "react-bootstrap/NavDropdown";
import React from "react";

export default function DropdownLinksWithIndicator({
   title,
   linksArray,
   dropEnd
}: {
   title: string,
   linksArray: NavLinksArrayType
   dropEnd?: boolean
}) {
   
   const currPathname = usePathname();
   return (
      <NavDropdown title={title} drop={dropEnd ? 'end' : 'down'}>
      {
         linksArray.map(({ displayedName, linksTo }) =>
            <React.Fragment key={displayedName}>

               <NavDropdown.Item
                  as={Link}
                  href={linksTo}
                  className={currPathname === linksTo ? 'fw-bold' : ''}
               >

                  {currPathname === linksTo ? '> ' : ''} {displayedName}
                  
               </NavDropdown.Item>

            </React.Fragment>
         )
      }
      </NavDropdown>
   );
}