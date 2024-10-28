import { connectToDB } from "./connectToDB";

export default async function fetchHomepageNotice() {
   try {
      const { db } = await connectToDB("notices");
      const data = await db
         .collection("notice")
         .findOne({}, { projection: { _id: 0, html: 1 } });
      
      return { __html: data?.html! as string };
   } catch (error) {
      console.error("Could not fetch notice for homepage:", error);
      return { __html: "<p>An error occured, try again later.</p>" };
   }
}