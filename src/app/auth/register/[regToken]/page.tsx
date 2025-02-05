"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BSForm from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import { Formik, Form, Field, ErrorMessage } from "formik";

import { useParams } from "next/navigation";

import * as yup from "yup";
import axios from "axios";
import { signIn } from "next-auth/react";

export default function RegistrationForm() {
   const { regToken } = useParams<{ regToken: string }>();

   const FormikElement = () => (
      <Formik
         initialValues={{ email: "", password: "", confirmPassword: "" }}
         validationSchema={yup.object({
            email: yup
               .string()
               .email("Invalid email address")
               .required("Required"),
            password: yup
               .string()
               .test(
                  "password-strength",
                  "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number",
                  (value) => {
                     if (!value) return false;
                     const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
                     return regex.test(value);
                  }
               )
               .required("Required"),
            confirmPassword: yup
               .string()
               .oneOf([yup.ref("password"), ""], "Passwords must match")
               .required("Required"),
         })}
         onSubmit={(values, { setSubmitting, setStatus, resetForm }) => {
            setSubmitting(true);
            axios
               .post("/api/user/create-new-user", 
                  {
                     email: values.email.toLowerCase().trim(),
                     password: values.password,
                     token: regToken,
                  }
               )
               .then(async (res) => {
                  resetForm();
                  setStatus({
                     msg: (
                        <Alert variant="success">
                           <strong>Success!</strong> Your account has been created. Logging you in...
                        </Alert>
                     ),
                  });

                  return await signIn("credentials", {
                     email: values.email.toLowerCase().trim(),
                     password: values.password.toLowerCase().trim(),
                     redirectTo: "/"
                  })
               })
               .catch((err) =>
                  setStatus({
                     msg: (
                        <Alert variant="danger">
                           {err.response?.data?.error ||
                              "Something went wrong."}
                        </Alert>
                     ),
                  })
               )
               .finally(() => setSubmitting(false));
         }}
      >
         {({ isSubmitting, status, errors, dirty }) => (
            <BSForm as={Form} noValidate>
               <BSForm.Group className="mb-3">
                  <BSForm.Label htmlFor="email">Email:</BSForm.Label>
                  <BSForm.Control as={Field} type="email" name="email" autoComplete="off"/>
                  <BSForm.Text
                     as={ErrorMessage}
                     name="email"
                     component="div"
                     className="text-danger"
                  />
               </BSForm.Group>

               <BSForm.Group className="mb-3">
                  <BSForm.Label htmlFor="password">Password:</BSForm.Label>
                  <BSForm.Control as={Field} type="text" name="password" autoComplete="off"/>
                  <BSForm.Text
                     as={ErrorMessage}
                     name="password"
                     component="div"
                     className="text-danger"
                  />
               </BSForm.Group>

               <BSForm.Group className="mb-3">
                  <BSForm.Label htmlFor="confirmPassword">
                     Confirm Password:
                  </BSForm.Label>
                  <BSForm.Control
                     as={Field}
                     type="text"
                     name="confirmPassword"
                     autoComplete="off"
                  />
                  <BSForm.Text
                     as={ErrorMessage}
                     name="confirmPassword"
                     component="div"
                     className="text-danger"
                  />
               </BSForm.Group>

               {status?.msg && (
                  <div className="mb-3 text-danger">{status.msg}</div>
               )}

               <div className="text-center d-flex flex-column align-items-center gap-2">
                  <Button
                     variant="success"
                     type="submit"
                     className="w-50"
                     disabled={
                        isSubmitting || Object.keys(errors).length > 0 || !dirty
                     }
                  >
                     {isSubmitting ? "Loading..." : "Register"}
                  </Button>
               </div>
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
                        Register Your Account
                     </Card.Title>
                     <FormikElement />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
}
