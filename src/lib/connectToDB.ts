"use server";

import chalk from "chalk";
import { Db, MongoClient, MongoClientOptions } from "mongodb";

const uri: string = process.env.MONGODB_URI ?? "";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

const options: MongoClientOptions = {
   connectTimeoutMS: 10000,
   socketTimeoutMS: 45000,
   serverSelectionTimeoutMS: 10000,
   maxPoolSize: 10
};

export async function connectToDB(databaseName: string, retries = 3) {
   console.log(chalk.bgYellow("🥬 Invoking connectToDB function"))

   if (cachedClient && cachedDb) {
   console.log(chalk.green("🥬 Using previous connection"))
      return {
         db: cachedDb,
         client: cachedClient,
      };
   }

   if (!uri) throw new Error("Missing database connection URI");
   
   try {
      const client = new MongoClient(uri, options);
      await client.connect();
      const db = client.db(databaseName);
      cachedClient = client;
      cachedDb = db;
      console.log(chalk.red("🥬 Creating new connection"))
      return { db, client };
   } catch (error) {
      if (error instanceof Error) {
         console.error("Failed to connect to MongoDB:", error.message);
      } else {
         console.error("An unexpected error occured:", error);
      }
      
      if (retries > 0) {
         console.log(`Retrying connnection... (${retries} attempts left)`);
         return connectToDB(databaseName, retries - 1);
      };
      throw new Error("Database connection failed after multiple attempts");
   }  
}