"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BSForm from "react-bootstrap/Form";
import Spinner from "react-bootstrap/esm/Spinner";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { createNewInvite, deleteInvite } from "@/lib/mongodb/user-server-actions";

import { UserInviteDocument } from "@/definitions";
import Table from "react-bootstrap/esm/Table";
import { DateTime } from "luxon";

type FormValues = { email: string };

const zodSchema = z.object({
   email: z.string().nonempty({ message: "Required" }).email({ message: "Invalid email" }),
})

export default function Invites({ allInvites }: { allInvites: UserInviteDocument[] }) {

   const { 
      register,
      handleSubmit,
      trigger,
      reset,
      formState: { errors, isValid, isDirty, isSubmitting },
   } = useForm<FormValues>({ 
      resolver: zodResolver(zodSchema),
      defaultValues: { email: "" }
   });

   return (
      <>
         <Container
            fluid
            className="d-flex align-items-center justify-content-center py-3"
         >
            <Row className="w-100 justify-content-center">
               <Col sm={10} md={8} lg={6}>
                  <Card className="p-4 shadow-lg border-0">
                     <Card.Body>
                        <Card.Title className="mb-4 text-center">
                           Create New (Unregistered) User
                        </Card.Title>
                        
                        <BSForm 
                           onSubmit={
                              handleSubmit(
                                 (data: FormValues) => {

                                    const newEmail = data.email.trim().toLowerCase();

                                    createNewInvite(newEmail)
                                       .then(res => {
                                          if (res.error!) {
                                             toast.error(res.error!);
                                          } else{
                                             toast.success("Successfully created new user invite for " + newEmail);
                                          }
                                          reset();
                                       })
                                       .catch(err => toast.error(err instanceof Error ? err.message : "An unexpected error occured."));
                                 }
                              )
                           }
                           noValidate
                        >

                           <BSForm.Group className="mb-3">
                              <BSForm.Label htmlFor="email">New User Email:</BSForm.Label>
                              <BSForm.Control 
                                 {...register("email", { required: true })}
                                 type="email"
                                 autoComplete="off"
                                 onBlur={() => trigger("email")}
                              />
                              <BSForm.Text className="text-danger">{errors.email?.message}</BSForm.Text>
                           </BSForm.Group>

                           <div className="text-center d-flex flex-column align-items-center gap-2">
                              <Button 
                                 type="submit"
                                 variant="success"
                                 className="w-50"
                                 disabled={!isDirty || !isValid || isSubmitting}
                              >
                                 {isSubmitting ? <Spinner size="sm"/> : "Generate Unique Link"}
                              </Button>
                           </div>

                        </BSForm>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>

         <Container>
            <Card className="shadow-lg border-0">
               <Card.Body>
                  <Table striped style={{fontSize: "12px"}}>
                     <thead>
                        <tr>
                           <th>Email</th>
                           <th>Date Created</th>
                           <th colSpan={2}>Unique Invite Link</th>
                        </tr>
                     </thead>
                     <tbody>
                        {allInvites.map(({ email, dateCreated, token }) => (
                           <tr key={email}>
                              <td>{email}</td>
                              <td>
                                 {DateTime.fromISO(dateCreated).toISODate()}
                              </td>
                              <td style={{ maxWidth: "400px" }}>
                                 {process.env.NEXT_PUBLIC_BASE_URL}/auth/register/{token}
                              </td>
                              <td>
                                 <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => {
                                       deleteInvite(email)
                                       .then(res => {
                                          if (res.error!) {
                                             toast.error(res.error!);
                                          } else {
                                             toast.success(`Invite for ${email} deleted successfully`);
                                          }
                                       })
                                       .catch(err => toast.error(err instanceof Error ? err.message : "An error occurred."));
                                    }}
                                 >
                                    Delete
                                 </Button>
                              </td>
                           </tr>
                        ))}
                        <tr>
                           <td colSpan={4} className="text-center text-secondary fst-italic">
                              Invites will appear here
                           </td>
                        </tr>
                     </tbody>
                  </Table>
               </Card.Body>
            </Card>
         </Container>
      </>
   );
}