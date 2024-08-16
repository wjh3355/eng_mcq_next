import { Db, MongoClient } from "mongodb";

const uri: string = process.env.MONGODB_URI ?? "";

if (!uri) {
   throw new Error("missing URI");
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDB(
   databaseName: string
): Promise<{ 
   db: Db; 
   client: MongoClient 
}> {
   if (cachedClient && cachedDb) {
      return {
         db: cachedDb,
         client: cachedClient,
      };
   }


   try {
      const client = new MongoClient(uri);

      await client.connect();

      const db = client.db(databaseName);

      cachedClient = client;
      cachedDb = db;

      return { db, client };
   } catch (error) {
      console.error("Failed to connect to MongoDB:", error);
      throw new Error("Database connection failed");
   }
}