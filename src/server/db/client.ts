import "server-only";
import { MongoClient, ServerApiVersion, type Db } from "mongodb";
import { env } from "@/server/env";

declare global {
  var _fitPlanetMongo: Promise<MongoClient> | undefined;
}

/**
 * One shared MongoClient per Node process. On Lightsail the app is a single
 * long-lived process, so the pool is created once and reused by every request.
 * The client is created lazily so builds without DB_URI still work.
 */
export function getMongoClient(): Promise<MongoClient> {
  if (!env.db.uri) {
    return Promise.reject(new Error("DB_URI is not set. Add your MongoDB connection string to .env.local"));
  }
  if (!global._fitPlanetMongo) {
    const client = new MongoClient(env.db.uri, {
      serverApi: { version: ServerApiVersion.v1, strict: false, deprecationErrors: true },
      maxPoolSize: 20,
      serverSelectionTimeoutMS: 8000,
    });
    global._fitPlanetMongo = client.connect().catch((error) => {
      global._fitPlanetMongo = undefined;
      throw error;
    });
  }
  return global._fitPlanetMongo;
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  return client.db(env.db.name);
}

export const isDbConfigured = () => Boolean(env.db.uri);
