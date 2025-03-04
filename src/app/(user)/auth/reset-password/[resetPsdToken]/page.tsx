"use client";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import BSForm from "react-bootstrap/Form";

import { useParams } from "next/navigation";

import axios, { AxiosError } from "axios";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Spinner from "react-bootstrap/esm/Spinner";
import toast from "react-hot-toast";
import Link from "next/link";

type FormData = {
   newPassword: string;
   confirmPassword: string;
}

const zodSchema = z.object({
   newPassword: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, 
         { message: "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number" }
      ),
   confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, { message: "Passwords must match", path: ["confirmPassword"] });

function ReactHookForm() {

   const { resetPsdToken } = useParams<{ resetPsdToken: string }>();

   const { 
      register,
      handleSubmit,
      trigger,
      reset,
      formState: { errors, isValid, isDirty, isSubmitting },
   } = useForm<FormData>({ 
      resolver: zodResolver(zodSchema),
      defaultValues: { newPassword: "", confirmPassword: "" },
   })

   async function attemptRegisterUser(data: FormData) {

      try {
         await axios.post("/api/user/reset-psd", 
            {
               newPassword: data.newPassword.trim(),
               token: resetPsdToken,
            }
         )

         reset();
         // added chinese for all the fucking PRCs
         toast.success("Password reset successfully! You may now login with your new password. 成功重置密码！您现在可使用新密码登录。");
         
      } catch (error) {
         if (error instanceof AxiosError) {

            switch (error.response?.data.error) {
               case "1":
                  toast.error(
                     <div>
                        <p>Invalid or expired token.</p>
                        <p>Please check your reset password link or request a new link <Link href="/auth/reset-password">here</Link>.</p>
                     </div>
                  );
                  break;
               default:
                  toast.error(error.response?.data.error || "Request error. Please try again.");
                  break;
            }
            
         } else {
            toast.error("An unknown error occured. Please try again.");
         }
      }

   };
   
   return (
      <BSForm onSubmit={handleSubmit(attemptRegisterUser)} noValidate>

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">New Password:</BSForm.Label>
            <BSForm.Control 
               {...register("newPassword", { required: true })}
               type="text"
               autoComplete="off"
               onBlur={() => trigger("newPassword")}
            />
            <BSForm.Text className="text-danger">{errors.newPassword?.message}</BSForm.Text>
         </BSForm.Group>

         <BSForm.Group className="mb-3">
            <BSForm.Label htmlFor="email">Confirm New Password:</BSForm.Label>
            <BSForm.Control 
               {...register("confirmPassword", { required: true })}
               type="text"
               autoComplete="off"
               onBlur={() => trigger("confirmPassword")}
            />
            <BSForm.Text className="text-danger">{errors.confirmPassword?.message}</BSForm.Text>
         </BSForm.Group>

         <div className="d-flex align-items-center justify-content-center">
            <Button 
               type="submit"
               variant="success"
               className="w-50"
               disabled={!isDirty || !isValid || isSubmitting}
            >
               {isSubmitting ? <Spinner size="sm"/> : "Reset Password"}
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
                        Enter a new password:
                     </Card.Title>
                     <ReactHookForm/>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Container>
   );
}
