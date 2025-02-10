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
            password: { label: "Password:", type: "password" }
         },
         async authorize(credentials) {
            try {      

               // console.log("\n\n" + JSON.stringify(credentials) + "\n\n")

               const zodRes = z.object({
                  email: z.string().nonempty(),
                  password: z.string().nonempty()
               }).safeParse(credentials);
               
               if (!zodRes.success) throw new CustomCredentialsError("1");

               const { email, password } = zodRes.data;
               
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

               // console.log(user);

               if (!(await compare(password, user.passwordHash))) throw new CustomCredentialsError("1");
               
               if (user.isSuspended) throw new CustomCredentialsError("2");

               return user;

            } catch (error) {
               if (error instanceof CustomCredentialsError) {
                  throw new CustomCredentialsError(error.code)
               } else {
                  throw new CustomCredentialsError("3")
               }
            }
         },
      }),
   ],
   
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
         }
         return token;
      },
      session({ session, token }) {
         session.user.email = token.email as string;
         session.user.role = token.role as string;
         return session;
      },
      // redirect({ url, baseUrl }) {
      //    if (url.startsWith("/dashboard")) {
      //      return `${baseUrl}/dashboard`;
      //    }
      //    return url;
      // },
   },
   
   secret: process.env.AUTH_SECRET,
});