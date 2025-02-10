"use client";

import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Card from "react-bootstrap/Card"
import Button from "react-bootstrap/Button"
import BSForm from "react-bootstrap/Form"
import Alert from "react-bootstrap/Alert"
import Spinner from "react-bootstrap/esm/Spinner";

import { LoginFormFields } from "@/definitions";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { z } from "zod";
import toast from "react-hot-toast";

const zodSchema = z.object({
   email: z.string().nonempty({ message: "Required" }).email({ message: "Invalid email" }),
   password: z.string().nonempty({ message: "Required" })
})

function ReactHookForm() {

   const router = useRouter();

   const { 
      register,
      handleSubmit,
      trigger,
      reset,
      formState: { errors, isValid, isDirty, isSubmitting },
   } = useForm<LoginFormFields>({ 
      resolver: zodResolver(zodSchema),
      defaultValues: { email: "", password: "" }
   })

   async function attemptLogIn(data: LoginFormFields) {

      try {
         const res = await signIn("credentials", {
            email: data.email.toLowerCase().trim(),
            password: data.password.trim(),
            redirect: false,
         });

         if (res?.error) {
            switch (res.code) {
               case "1":
                  toast.error("Invalid email or password.");
                  break;
               case "2":
                  toast.error("You have been suspended!");
                  break;
               case "3":
               default:
                  toast.error("An error occurred. Please try again.");
                  break;
            }
         } else {
            reset();
            toast.success("Welcome! Redirecting...");
            await new Promise((r) => setTimeout(r, 500));
            router.push("/");
         }
      } catch (e) {
         toast.error("An error occurred. Please try again.");
      }
   };
   
   return (
      <BSForm 
         onSubmit={handleSubmit(attemptLogIn)}
         noValidate
      >

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Email:</BSForm.Label>
            <BSForm.Control 
               {...register("email", { required: true })}
               type="email"
               onBlur={() => trigger("email")}
            />
            <BSForm.Text className="text-danger">{errors.email?.message}</BSForm.Text>
         </BSForm.Group>

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Password:</BSForm.Label>
            <BSForm.Control 
               {...register("password", { required: true })}
               type="password"
               onBlur={() => trigger("password")}
            />
            <BSForm.Text className="text-danger">{errors.password?.message}</BSForm.Text>
         </BSForm.Group>

         <div className="text-center d-flex flex-column align-items-center gap-2">
            <Button 
               type="submit"
               variant="success"
               className="w-50"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting ? <Spinner size="sm"/> : "Sign In"}
            </Button>
            <Link href="/auth/reset-password">Forgot Password?</Link>
         </div>

      </BSForm>
   )
}

export default function SignInForm() {

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
                  <Card className="p-2 p-md-4 shadow-sm">
                     <Card.Body>

                        <Card.Title className="mb-4 text-center">
                           Sign In to Sunbird English
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
