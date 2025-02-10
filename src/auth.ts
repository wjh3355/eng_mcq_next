import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import axios from "axios";
import { UserAuthDocument } from "./definitions";
import { z } from "zod";

class CustomCredentialsError extends CredentialsSignin {
   constructor(code: string) {
      super();
      this.code = code;
   }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
   // debug: true,

   pages: {
      signIn: "/auth",
   },

   providers: [
      Credentials({
         credentials: {
            email: { label: "Email:", type: "email" },
            password: { label: "Password:", type: "password" },
            rememberMe: { label: "Remember me", type: "checkbox" }
         },
         async authorize(credentials) {

            // error codes:
            // 1: invalid credentials
            // 2: user suspended
            // 3: unknown error

            try {      

               // validate credentials
               // if invalid, throw error code 1
               const zodRes = z.object({
                  email: z.string().nonempty().email(),
                  password: z.string().nonempty(),
                  rememberMe: z.enum(["true", "false"]),
               }).safeParse(credentials);
               
               if (!zodRes.success) throw new CustomCredentialsError("1");

               const { email, password, rememberMe } = zodRes.data;
               
               // check if user exists
               // if not, throw error code 1
               const res = await axios.get(
                  `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/get-user-authenticate-only`, 
                  {
                     params: { email },
                     headers: { Authorization: `Bearer ${process.env.AUTH_SECRET}` }
                  }
               ).catch(err => {
                  throw new CustomCredentialsError("1")
               })

               const user: UserAuthDocument = res.data.userDoc;

               // check if password is correct, if not, throw error code 1
               if (!(await compare(password, user.passwordHash))) throw new CustomCredentialsError("1");
               
               // check if user is suspended, if so, throw error code 2
               if (user.isSuspended) throw new CustomCredentialsError("2");

               const maxAge = rememberMe === "true" ? 30 * 24 * 60 * 60 : 24 * 60 * 60; // 30 days or 1 day

               return { ...user, maxAge };

            } catch (error) {
               if (error instanceof CustomCredentialsError) {
                  // known error: re-throw error code
                  throw new CustomCredentialsError(error.code)
               } else {
                  // unknown error: throw error code 3
                  throw new CustomCredentialsError("3")
               }
            }
         },
      }),
   ],

   session: {
      strategy: "jwt",
   },
   
   callbacks: {
      signIn() {
         return true;
      },
      authorized: async ({ auth }) => {
         return !!auth;
      },
      jwt({ token, user }){
         if (user) {
            token.email = user.email;
            token.role = user.role;
            const maxAge = user.maxAge;
            token.exp = Math.floor(Date.now() / 1000) + maxAge;
         }
         return token;
      },
      session({ session, token }) {
         session.user.email = token.email as string;
         session.user.role = token.role as string;
         session.user.maxAge = token.maxAge as number;
         return session;
      },
   },
   
   secret: process.env.AUTH_SECRET,
});