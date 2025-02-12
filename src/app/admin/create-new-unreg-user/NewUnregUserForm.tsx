"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BSForm from "react-bootstrap/Form";

import axios, { AxiosError } from "axios";
import { UserInviteDocument } from "@/definitions";
import { z } from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "react-bootstrap/esm/Spinner";
import { DateTime } from "luxon";
import toast from "react-hot-toast";

type FormValues = { email: string };

const zodSchema = z.object({
   email: z.string().nonempty({ message: "Required" }).email({ message: "Invalid email" }),
})

function ReactHookForm() {

   const [message, setMessage] = useState<null | React.JSX.Element>(null);

   const { 
      register,
      handleSubmit,
      trigger,
      formState: { errors, isValid, isDirty, isSubmitting },
   } = useForm<FormValues>({ 
      resolver: zodResolver(zodSchema),
      defaultValues: { email: "" }
   })

   async function attemptCreateNewUnregUser(data: FormValues) {
      setMessage(null);

      try {
         const res = await axios.post("/api/user/create-new-unreg-user", { email: data.email.toLowerCase().trim() });
   
         const newInvite = res.data.newInvite as UserInviteDocument;
         setMessage(
            <p className="text-success">
               Send this link to the new user to register their
               account:
               <br />
               <strong>
                  {process.env.NEXT_PUBLIC_BASE_URL}/auth/register/{newInvite.token}
               </strong>
               <br/>
               Invite created {DateTime.fromISO(newInvite.dateCreated).toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY)}. Will not expire.
            </p>
         );
         toast.success("Successfully created new user invite.");

      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error("Request error. Try again.");
         } else {
            toast.error("An unknown error occured. Please try again.");
         }
      }

   };
   
   return (
      <BSForm 
         onSubmit={handleSubmit(attemptCreateNewUnregUser)}
         noValidate
      >

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">New User Email:</BSForm.Label>
            <BSForm.Control 
               {...register("email", { required: true })}
               type="email"
               onBlur={() => trigger("email")}
            />
            <BSForm.Text className="text-danger">{errors.email?.message}</BSForm.Text>
         </BSForm.Group>

         {message &&
            <div className="mb-3 text-danger">
               {message}
            </div>
         }

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
   )
}

export default function NewUnregUserForm() {

   return (
      <Container
         fluid
         className="d-flex align-items-center justify-content-center py-3"
      >
         <Row className="w-100 justify-content-center">
            <Col sm={10} md={8} lg={6}>
               <Card className="p-4 shadow-sm">
                  <Card.Body>
                     <Card.Title className="mb-4 text-center">
                        Create New (Unregistered) User
                     </Card.Title>
                     <ReactHookForm />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
}