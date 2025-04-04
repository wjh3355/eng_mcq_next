"use client";

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import BSForm from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"

import Link from "next/link";
import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "react-bootstrap/esm/Spinner";

const zodSchema = z.object({
   email: z.string().nonempty({ message: "Required" }).email({ message: "Invalid email" }),
})

type FormValues = { email: string };

function ReactHookForm() {

   const { 
      register,
      handleSubmit,
      trigger,
      formState: { errors, isValid, isDirty, isSubmitting },
      reset
   } = useForm<FormValues>({ 
      resolver: zodResolver(zodSchema),
      defaultValues: { email: "" }
   })

   async function attemptCreateResetLink(data: FormValues) {

      try {

         await axios.post("/api/user/gen-reset-psd-token", { email: data.email.toLowerCase().trim() })

         reset();

         toast.success(
            <div>
               <p>If your email is registered with us, you will receive a password reset link.</p>                  
               <p>Please also check your spam folder.</p>
            </div>,
            { style: { width: "1000px" },  duration: 6000 }
         );

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
         onSubmit={handleSubmit(attemptCreateResetLink)}
         noValidate
      >

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Enter your email to get a reset link:</BSForm.Label>
            <BSForm.Control 
               {...register("email", { required: true })}
               type="email"
               onBlur={() => trigger("email")}
            />
            <BSForm.Text className="text-danger">{errors.email?.message}</BSForm.Text>
         </BSForm.Group>

         <div className="text-center d-flex flex-column align-items-center gap-3">
            <Button 
               type="submit"
               variant="success"
               className="w-50"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting ? <Spinner size="sm"/> : "Reset Password"}
            </Button>
            <Link href="/auth">Back to Log In</Link>
         </div>

      </BSForm>
   )
}

export default function ResetPasswordForm() {

   return (
      <>
         {/* <Container>
            <Alert variant="info border-0 shadow" className="mt-3">
               ⚠️ <strong>Notice:</strong> With effect from 19th February 2025, the authentication system will be overhauled. Existing users are required to reset their password using the form below before logging in. We apologise for any inconvenience caused. 若您是现有用户，请在登录前使用以下表格重设密码。我们为此给您带来的不便致以歉意。
            </Alert>
         </Container> */}
         <Container fluid className="d-flex align-items-center justify-content-center py-3">
            <Row className="w-100 justify-content-center">
               <Col sm={10} md={8} lg={6}>
                  <Card className="p-2 p-md-4 shadow-lg border-0 rounded-4">
                     <Card.Body>
                        <Card.Title className="mb-4 text-center">
                           Forgot your password?
                        </Card.Title>
                        <ReactHookForm/>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </Container>
      </>
   );
}
