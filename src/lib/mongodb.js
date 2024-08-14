import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

// let cachedClient = null;
// let cachedDb = null;

export async function connectToDB() {
   // if (cachedClient && cachedDb) {
   //    return { db: cachedDb, client: cachedClient };
   // }
  
   try {
      await client.connect();

      const qnDB = client.db("english_questions");

      // cachedClient = client;
      // cachedDb = qnDB;

      return { qnDB, client };
   } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw new Error("Database connection failed");
   }
}