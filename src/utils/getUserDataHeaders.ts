import { HeaderUserDetails } from "@/types";
import { headers } from "next/headers";

export default async function getUserDataHeaders(): Promise<HeaderUserDetails> {
   const headersList = await headers();

   return {
      kindeUserGivenName: headersList.get("x-user-given-name")!,
      kindeUserEmail: headersList.get("x-user-email")!,
      kindeUserId: headersList.get("x-user-id")!,
   };
}
