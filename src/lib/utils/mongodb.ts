"use server";

import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.DB_URI || process.env.MONGODB_URI;
const db_name = process.env.DB_NAME;

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add these options for better Vercel compatibility
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Global declaration to avoid TypeScript error for global variable
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the MongoClient is not repeatedly created
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDatabase(): Promise<Db> {
  try {
    console.log("Attempting to connect to MongoDB...");
    const client = await clientPromise;
    console.log("Successfully connected to MongoDB");
    return client.db(db_name);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
