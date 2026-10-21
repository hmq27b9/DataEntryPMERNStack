//config/mongo.ts
import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not defined in .env");

const client = new MongoClient(uri);

let db: Db | null = null;

export async function getMongoDb(): Promise<Db> {
  if (!db) {
    await client.connect();
    // The database name is part of the connection string, or you can specify it here.
    // For example: client.db("dataentry_mongo")
    db = client.db();
  }
  return db;
}

// Graceful shutdown
process.on("SIGINT", async () => {
  await client.close();
  process.exit(0);
});
