import { connectToDB } from "@/app/lib/mongodb";

export async function GET(request) {

   try {

      const { qnDB } = await connectToDB();
      const qns = qnDB.collection("questions1");

      const url = new URL(request.url);
      const qnNum = parseInt(url.searchParams.get("qnNum"), 10);
      
      const qn = await qns.findOne(
         { qnNum }, 
         { projection: { _id: 0 } }
      );

      return new Response(JSON.stringify(qn), {
         headers: { "Content-Type": "application/json" },
      });
      
   } catch (error) {
      console.error("Error in GET request:", error);

      return new Response(JSON.stringify({ error: error.message }), {
         status: 500,
         headers: { "Content-Type": "application/json" },
      });
   }
}
