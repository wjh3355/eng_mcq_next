"use client";

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import BSForm from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

import { Formik, Form, Field, ErrorMessage } from "formik";

import * as yup from "yup";
import Link from "next/link";
import axios from "axios";

export default function ResetPasswordForm() {

   const FormikElement = () => 
      <Formik
         initialValues={{ email: "", password: "" }}
         validationSchema={yup.object({
            email: yup.string().email("Invalid email address").required("Required"),
         })}
         onSubmit={(values, { setSubmitting, setStatus }) => {
            
            setSubmitting(true);
            setStatus({});

            axios
               .post("/api/user/gen-reset-psd-token", { email: values.email.toLowerCase().trim() })
               .then((res) => {
                  setStatus({ msg: "You will receive a password reset link if your email is registered with us. Please check your spam folder too." });
               })
               .catch((err) => {
                  setStatus({ msg: err.response?.data?.error || "Something went wrong." });
               })
               .finally(() => setSubmitting(false));
            
         }}
      >
         {({ isSubmitting, status, errors, dirty }) => (
            <BSForm as={Form} noValidate>
               <BSForm.Group className="mb-3">
                  <BSForm.Label htmlFor="email">Email:</BSForm.Label>
                  <BSForm.Control as={Field} type="email" name="email" />
                  <BSForm.Text as={ErrorMessage} name="email" component="div" className="text-danger"/>
               </BSForm.Group>

               {status?.msg && <div className="mb-3 text-danger">{status.msg}</div>}

               <div className="text-center d-flex flex-column align-items-center gap-2">
                  <Button
                     variant="success"
                     type="submit"
                     className="w-50"
                     disabled={isSubmitting || Object.keys(errors).length > 0 || !dirty}
                  >
                     {isSubmitting ? "Loading..." : "Send Reset Email"}
                  </Button>
                  <Link href="/auth">Back to login page</Link>
               </div>
            </BSForm>
         )}
      </Formik>

   return (
      <>
         <Container>
            <Alert variant="danger" className="mt-3">
               <strong>IMPORTANT:</strong> Due to a migration of authentication software, all existing users are required to <Link href="/auth/reset-password">reset their password</Link> before login.
            </Alert>
         </Container>
         <Container fluid className="d-flex align-items-center justify-content-center py-3">
            <Row className="w-100 justify-content-center">
               <Col sm={10} md={8} lg={6}>
                  <Card className="p-4 shadow-sm">
                     <Card.Body>
                        <Card.Title className="mb-4 text-center">
                           Enter your email to reset password
                        </Card.Title>
                        <FormikElement/>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>
      </>
   );
}
