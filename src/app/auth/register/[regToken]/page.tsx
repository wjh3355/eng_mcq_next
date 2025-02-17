"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BSForm from "react-bootstrap/Form";

import { useParams } from "next/navigation";

import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "react-bootstrap/esm/Spinner";
import toast from "react-hot-toast";

import Link from "next/link";

type FormData = {
   email: string;
   password: string;
   confirmPassword: string;
}

const zodSchema = z.object({
   email: z.string().nonempty({ message: "Required" }).email({ message: "Invalid email" }),
   password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, { message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number" }),
   confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

function ReactHookForm() {

   const { regToken } = useParams<{ regToken: string }>();

   const { 
      register,
      handleSubmit,
      trigger,
      reset,
      formState: { errors, isValid, isDirty, isSubmitting },
   } = useForm<FormData>({ 
      resolver: zodResolver(zodSchema),
      defaultValues: { email: "", password: "", confirmPassword: "" },
   })

   async function attemptRegisterUser(data: FormData) {

      try {
         await axios.post("/api/user/create-new-user", 
            {
               email: data.email.toLowerCase().trim(),
               password: data.password.trim(),
               token: regToken,
            }
         )

         toast.success("Account created successfully! Logging you in...");

         reset();

         await new Promise(resolve => setTimeout(resolve, 500));

         await signIn("credentials", {
            email: data.email.toLowerCase().trim(),
            password: data.password.trim(),
            redirectTo: "/"
         })
         
      } catch (error) {
         if (error instanceof AxiosError) {
            toast.error(
               <div>
                  <p>Sorry, we were unable to create your account.</p>
                  <p>If you have already registered, please <Link href="/auth">Log In</Link>.</p>
                  <p>If you do intend to register, please check your email and registration link. Make sure you have an internet connection.</p>
               </div>,
               { style: { width: "1000px" } },
            );
         } else {
            toast.error("An unknown error occured. Please try again.");
         }
      }

   };
   
   return (
      <BSForm onSubmit={handleSubmit(attemptRegisterUser)} noValidate>

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Email:</BSForm.Label>
            <BSForm.Control 
               {...register("email", { required: true })}
               type="email"
               autoComplete="off"
               onBlur={() => trigger("email")}
            />
            <BSForm.Text className="text-danger">{errors.email?.message}</BSForm.Text>
         </BSForm.Group>

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Password:</BSForm.Label>
            <BSForm.Control 
               {...register("password", { required: true })}
               type="text"
               autoComplete="off"
               onBlur={() => trigger("password")}
            />
            <BSForm.Text className="text-danger">{errors.password?.message}</BSForm.Text>
         </BSForm.Group>

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Confirm Password:</BSForm.Label>
            <BSForm.Control 
               {...register("confirmPassword", { required: true })}
               type="text"
               autoComplete="off"
               onBlur={() => trigger("confirmPassword")}
            />
            <BSForm.Text className="text-danger">{errors.confirmPassword?.message}</BSForm.Text>
         </BSForm.Group>


         <div className="text-center d-flex flex-column align-items-center gap-3">
            <Button 
               type="submit"
               variant="success"
               className="w-50"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting ? <Spinner size="sm"/> : "Register Account"}
            </Button>
         </div>

      </BSForm>
   )
}

export default function RegistrationForm() {

   return (
      <Container
         fluid
         className="d-flex align-items-center justify-content-center py-3"
      >
         <Row className="w-100 justify-content-center">
            <Col sm={10} md={8} lg={6}>
               <Card className="p-2 p-md-4 shadow-lg border-0 rounded-4">
                  <Card.Body>
                     <Card.Title className="mb-4 text-center">
                        Register Your Account
                     </Card.Title>
                     <ReactHookForm/>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
}
