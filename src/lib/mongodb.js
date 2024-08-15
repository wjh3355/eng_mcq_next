import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

let cachedClient = null;
let cachedDb = null;

export async function connectToDB(databaseName) {
   if (cachedClient && cachedDb) {
      return { 
         db: cachedDb, 
         client: cachedClient 
      };
   }
  
   try {
      await client.connect();

      const db = client.db(databaseName);

      cachedClient = client;
      cachedDb = db;

      return { db, client };
      
   } catch (error) {
      console.error("Failed to connect to MongoDB", error);
      throw new Error("Database connection failed");
   }
}