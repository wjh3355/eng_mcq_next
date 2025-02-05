import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import axios from "axios";
import { UserAuthDocument } from "./definitions";
import { z } from "zod";

const credSchema = z.object({
   email: z.string().email().nonempty(),
   password: z.string().nonempty()
})

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
         async authorize(credentials): Promise<UserAuthDocument | null> {
            try {               
               const zodRes = credSchema.safeParse(credentials);
               
               if (!zodRes.success) throw new Error("Invalid credentials type");

               const { email, password } = zodRes.data;
               
               const res = await axios.get(
                  `${process.env.BASE_URL}/api/user/get-user-authenticate-only`, 
                  {
                     params: { email, type: "auth" },
                     headers: { Authorization: `Bearer ${process.env.AUTH_SECRET}` }
                  }
               );
   
               if (res.status !== 200) throw new Error("API error: " + res.data.error);
   
               const user: UserAuthDocument = res.data.userDoc;

               if (!(await compare(password, user.passwordHash))) throw new Error("Incorrect password");
   
               return user;

            } catch (error) {
               console.log(error)
               return null;
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