import { MongoClient } from "mongodb";

const uri = "mongodb+srv://jhwang0324:1234567890@cluster1234.0fl6p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1234";

const client = new MongoClient(uri);

export async function connectToDB() {
   
   await client.connect();

   const qnDB = client.db("english_questions");

   return { qnDB, client };
}