import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Database connection - initialized lazily at runtime
export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl || databaseUrl.includes("api.region.aws.neon.tech") || databaseUrl.includes("ep-xyz")) {
    throw new Error(
      "❌ INVALID DATABASE URL: You are still using the placeholder URL. " +
      "Please go to https://neon.tech, create a project, and paste your connection string in the .env file."
    );
  }
  const sql = neon(databaseUrl);
  return drizzle(sql, { schema });
}
