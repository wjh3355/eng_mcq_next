import { usePathname } from "next/navigation";
import { QnSetType } from "@/lib/data";
import Link from "next/link";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function DropdownLinksWithIndicator({
   title,
   sets,
   dropEnd
}: {
   title: string,
   sets: QnSetType[],
   dropEnd?: boolean
}) {
   
   const currPathname = usePathname();

   return (
      <NavDropdown title={title} drop={dropEnd ? 'end' : 'down'}>
      {
         sets.map(({ name, href }) =>
            <NavDropdown.Item
               as={Link}
               href={href}
               key={name}
               className={currPathname === href ? 'fw-bold' : ''}
            >
               {name}
            </NavDropdown.Item>
         )
      }
      </NavDropdown>
   );
}