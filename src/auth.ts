import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
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
               const zodRes = z.object({
                  email: z.string().nonempty().email(),
                  password: z.string().nonempty(),
                  rememberMe: z.enum(["true", "false"]),
               }).safeParse(credentials);
               
               if (!zodRes.success) throw new CustomCredentialsError("1");

               const { email, password, rememberMe } = zodRes.data;
               
               // Check if user exists
               const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/get-user-authenticate-only?email=${email}`, {
                  method: 'GET',
                  headers: {
                     'Authorization': `Bearer ${process.env.AUTH_SECRET}`,
                  },
               }).catch(err => { throw new CustomCredentialsError("1") });
               
               if (res.status !== 200) throw new CustomCredentialsError("1");
               
               const user: UserAuthDocument = (await res.json()).userDoc;

               // check if password is correct, if not, throw error code 1
               if (!(await compare(password, user.passwordHash))) throw new CustomCredentialsError("1");
               
               // check if user is suspended, if so, throw error code 2
               if (user.isSuspended) throw new CustomCredentialsError("2");

               const maxAge = rememberMe === "true" ? 1 * 24 * 60 * 60 : 6 * 60 * 60; // 2 days or 6 hours

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
         session.user.role = token.role as 'user' | 'admin';
         session.user.maxAge = token.maxAge as number;
         return session;
      },
   },
   
   secret: process.env.AUTH_SECRET,

   trustHost: true,
});