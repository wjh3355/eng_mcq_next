"use server";

import { Db, MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
const connectionCache: Map<string, { client: MongoClient; db: Db }> = new Map();
const options: MongoClientOptions = {
   connectTimeoutMS: 10000,
   socketTimeoutMS: 45000,
   serverSelectionTimeoutMS: 10000,
   maxPoolSize: 10
};

export async function connectToDB(databaseName: string, retries = 3) {
   // console.log("Calling connectToDB for database: " + databaseName);
   // console.log(connectionCache);

   if (connectionCache.has(databaseName)) {
      // console.log(chalk.green("Using prev connection for database: " + databaseName));
      return connectionCache.get(databaseName)!;
   }

   if (!uri) throw new Error("The database connection URI is missing");
   
   try {
      const newClient = new MongoClient(uri, options);
      await newClient.connect();
      const newDb = newClient.db(databaseName);

      const newConnection = { client: newClient, db: newDb }
      connectionCache.set(databaseName, newConnection);

      // console.log(chalk.red("Creating new connection for database: " + databaseName));

      return newConnection;
      
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