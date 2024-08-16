import { connectToDB } from "@/lib/mongodb";

export async function GET(request: Request): Promise<Response> {
   
   try {

      const { db } = await connectToDB("english_questions");
      const qns = db.collection("questions1");

      const { searchParams } = new URL(request.url);
      const qnNumStr = searchParams.get('qnNum');

      if (!qnNumStr) {
         return new Response(
            JSON.stringify({ error: "Unspecified qnNum parameter" }),
            { 
               status: 400, 
               headers: { "Content-Type": "application/json" } 
            }
         );
      };

      const qnNum = parseInt(qnNumStr, 10);

      if (isNaN(qnNum)) {
         return new Response(
            JSON.stringify({ error: "Invalid qnNum parameter" }),
            { 
               status: 400, 
               headers: { "Content-Type": "application/json" } 
            }
         );
      };

      const qn = await qns.findOne(
         { qnNum }, 
         { projection: { _id: 0 } }
      );

      if (!qn) {
         return new Response(
            JSON.stringify({ error: `Question ${qnNum} not found` }), 
            {
               status: 404,
               headers: { "Content-Type": "application/json" },
            }
         );
      };

      return new Response(
         JSON.stringify(qn),
         {
            status: 200,
            headers: {"Content-Type": "application/json"}
         }
      );

   } catch (error: unknown) {

      if (error instanceof Error) {
         console.error("Error in GET request:", error);

         return new Response(
            JSON.stringify({ error: error.message }), 
            {
               status: 500,
               headers: { "Content-Type": "application/json" },
            }
         );
      } else {
         console.error("Unexpected error in GET request:", error);

         return new Response(
            JSON.stringify({ error: 'An unexpected error occurred.' }), 
            {
               status: 500,
               headers: { "Content-Type": "application/json" },
            }
         );
      }
   }

}