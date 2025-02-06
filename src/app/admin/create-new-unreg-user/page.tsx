"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BSForm from "react-bootstrap/Form";

import { Formik, Form, Field, ErrorMessage } from "formik";

import * as yup from "yup";

import axios from "axios";
import { UserInviteDocument } from "@/definitions";

export default function CreateNewUnregisteredUserForm() {

   const yupValidationSchema = yup.object({
      email: yup
         .string()
         .email("Invalid email address")
         .required("Required"),
   })

   const FormikElement = () => (
      <Formik
         initialValues={{ email: "" }}
         validationSchema={yupValidationSchema}
         onSubmit={(values, { setSubmitting, setStatus }) => {

            setSubmitting(true);
            setStatus({});
            
            axios
               .post("/api/user/create-new-unreg-user", { email: values.email })
               .then((res) => {
                  const newInvite = res.data.newInvite as UserInviteDocument;
                  setStatus({
                     msg: (
                        <p className="text-success">
                           Success! Send this link to the new user to register their
                           account:
                           <br />
                           <strong>
                              sunbirdenglish.com/auth/register/{newInvite.token}
                           </strong>
                           <br/>
                           Invite created {newInvite.dateCreated}
                        </p>
                     ),
                  })
               })
               .catch((err) =>
                  setStatus({
                     msg: (
                        <p className="text-danger">
                           {err.response?.data?.error || "Something went wrong."}
                        </p>
                     ),
                  })
               )
               .finally(() => setSubmitting(false));
         }}
      >
         {({ isSubmitting, status, errors, dirty }) => (
            <BSForm as={Form} noValidate>
               <BSForm.Group className="mb-3">
                  <BSForm.Label htmlFor="email">New User Email:</BSForm.Label>
                  <BSForm.Control as={Field} type="email" name="email" autoComplete="off"/>
                  <BSForm.Text
                     as={ErrorMessage}
                     name="email"
                     component="div"
                     className="text-danger"
                  />
               </BSForm.Group>

               <div className="text-center d-flex flex-column align-items-center gap-2">
                  <Button
                     variant="primary"
                     type="submit"
                     className="w-50"
                     disabled={
                        isSubmitting || Object.keys(errors).length > 0 || !dirty
                     }
                  >
                     {isSubmitting ? "Loading..." : "Create unregistered user"}
                  </Button>
               </div>

               {status?.msg && (
                  <div className="mt-3">{status.msg}</div>
               )}
            </BSForm>
         )}
      </Formik>
   );

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
                     <FormikElement />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
}
