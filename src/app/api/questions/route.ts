import { connectToDB } from "@/lib/mongodb";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const JSON_HEADERS = { "Content-Type": "application/json" };

function createErrorResponse(errorCode: number, description: string) {
   return new Response(
      JSON.stringify({ error: description }),
      {
         status: errorCode,
         headers: JSON_HEADERS
      }
   )
};

export async function GET(request: Request): Promise<Response> {

   try {

      const { isAuthenticated } = getKindeServerSession();
      const isLoggedIn = await isAuthenticated();
      if (!isLoggedIn) return createErrorResponse(401, "Unauthorised API usage");
      
      const { db } = await connectToDB("english_questions");
      
      const { searchParams } = new URL(request.url);
      
      const collectionToFetch = searchParams.get('collection');
      if (!collectionToFetch) return createErrorResponse(400, "Unspecified db parameter");

      
      const qnNumStr = searchParams.get('qnNum');
      if (!qnNumStr) return createErrorResponse(400, "Unspecified qnNum parameter");
      const qnNum = parseInt(qnNumStr, 10);
      if (isNaN(qnNum)) return createErrorResponse(400, "Invalid qnNum parameter");
      
      const qnToFetch = await db
         .collection(collectionToFetch)
         .findOne(
         { qnNum }, 
         { projection: { _id: 0 } }
      );

      if (!qnToFetch) return createErrorResponse(404, 
         `Qn ${qnNum} not found in collection '${collectionToFetch}'`);

      return new Response(
         JSON.stringify(qnToFetch),
         {
            status: 200,
            headers: JSON_HEADERS
         }
      );

   } catch (error: unknown) {

      if (error instanceof Error) {
         console.error("Error in GET request:", error);

         return createErrorResponse(500, error.message);
         
      } else {
         console.error("Unexpected error in GET request:", error);
         
         return createErrorResponse(500, 'An unexpected error occurred.');
         
      }
   }

}