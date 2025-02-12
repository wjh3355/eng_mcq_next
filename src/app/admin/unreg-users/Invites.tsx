"use client";

import { UserInviteDocument } from "@/definitions";
import { DateTime } from "luxon";
import React from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/esm/Container";
import Table from "react-bootstrap/esm/Table";

export default function Invites({ allInvites }: { allInvites: UserInviteDocument[] }) {
   return (
      <Container>
         <Card className="shadow-lg border-0">
            <Card.Body>
               <Table striped>
                  <thead>
                     <tr>
                        <th>Email</th>
                        <th>Date Created</th>
                        <th>Unique Invite Link</th>
                     </tr>
                  </thead>
                  <tbody>
                     {allInvites.map((invite) => (
                        <tr key={invite.email}>
                           <td>{invite.email}</td>
                           <td>
                              {DateTime.fromISO(invite.dateCreated).toISODate()}
                           </td>
                           <td style={{ maxWidth: "400px" }}>
                              {process.env.NEXT_PUBLIC_BASE_URL}/auth/register/
                              {invite.token}
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </Table>
            </Card.Body>
         </Card>
      </Container>
   );
}
