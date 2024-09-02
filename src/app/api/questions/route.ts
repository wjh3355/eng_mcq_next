// import { connectToDB } from "@/lib/connectToDB";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const JSON_HEADERS = { "Content-Type": "application/json" };
const HTTP_STATUS = {
   OK: 200,
   BAD_REQUEST: 400,
   UNAUTHORIZED: 401,
   NOT_FOUND: 404,
   INTERNAL_SERVER_ERROR: 500,
};
const collectionNames = [
   'gep_vocab', 'phrasal_verbs'
];

function createResponse(status: number, body: object) {
   return new Response(
      JSON.stringify(body),
      {
         status: status,
         headers: JSON_HEADERS
      }
   )
};

export async function GET(request: Request): Promise<Response> {

   // this API endpoint isnt necessary right now
   return createResponse(
      HTTP_STATUS.UNAUTHORIZED, { error: "This API is deprecated" }
   );

   // try {

   //    const { isAuthenticated } = getKindeServerSession();
   //    const isLoggedIn = await isAuthenticated();
   //    if (!isLoggedIn) return createResponse(
   //       HTTP_STATUS.UNAUTHORIZED, { error: "Unauthorised" });
      
   //    const { db } = await connectToDB("english_questions");
      
   //    const { searchParams } = new URL(request.url);
      
   //    const collectionToFetch = searchParams.get('collection');
   //    const qnNumStr = searchParams.get('qnNum');
   //    if (!collectionToFetch || !qnNumStr) return createResponse(
   //       HTTP_STATUS.BAD_REQUEST, { error: "Unspecified parameter(s)" });

   //    const qnNum = parseInt(qnNumStr, 10);
   //    if (isNaN(qnNum) || !collectionNames.includes(collectionToFetch)) return createResponse(
   //       HTTP_STATUS.BAD_REQUEST, { error: "Invalid parameter(s)" });
      
   //    const qnToFetch = await db
   //       .collection(collectionToFetch)
   //       .findOne(
   //       { qnNum }, 
   //       { projection: { _id: 0 } }
   //    );

   //    if (!qnToFetch) return createResponse(
   //       HTTP_STATUS.NOT_FOUND, { error: 'Question not found' });

   //    return createResponse(
   //       HTTP_STATUS.OK, qnToFetch);

   // } catch (error: unknown) {

   //    if (error instanceof Error) {
   //       console.error("Error in GET request:", error.message);

   //       return createResponse(
   //          HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: error.message });
         
   //    } else {
   //       console.error("Unexpected error in GET request:", error);
         
   //       return createResponse(
   //          HTTP_STATUS.INTERNAL_SERVER_ERROR, { error: 'An unexpected error occurred.' });
         
   //    }
   // }
      
}