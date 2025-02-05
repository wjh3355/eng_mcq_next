import "next-auth";

declare module "next-auth" {
   interface User {
      email: string;
      passwordHash: string;
      role: "user" | "admin";
      psdResetToken: string | null;
      psdResetTokenExpiry: string | null;
      dateCreated: string;
   }

   interface Session {
      user: {
         email: string;
         role: "user" | "admin";
      } & DefaultSession["user"];
   }
}

declare module "@auth/core/adapters" {
   interface AdapterUser {
      email: string;
      passwordHash: string;
      role: "user" | "admin";
      psdResetToken: string | null;
      psdResetTokenExpiry: string | null;
      dateCreated: string;
   }
}
