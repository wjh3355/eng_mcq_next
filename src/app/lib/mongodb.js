import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

export async function connectToDB() {
   
   await client.connect();

   const qnDB = client.db("english_questions");

   return { qnDB, client };
}