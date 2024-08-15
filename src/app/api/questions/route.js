import { connectToDB } from "@/lib/mongodb";

export async function GET(request) {

   try {

      const { db } = await connectToDB("english_questions");
      const qns = db.collection("questions1");

      const url = new URL(request.url);
      const qnNum = parseInt(url.searchParams.get("qnNum"), 10);

      if (isNaN(qnNum)) {
         return new Response(
            JSON.stringify({ error: "qnNum parameter is invalid" }),
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
            headers: { "Content-Type": "application/json" }
         }
      );
      
   } catch (error) {
      console.error("Error in GET request:", error);

      return new Response(
         JSON.stringify({ error: error.message }), 
         {
            status: 500,
            headers: { "Content-Type": "application/json" },
         }
      );
   }
}
