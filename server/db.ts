// lib/db.ts
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@shared/schema";

// Load environment variables from .env file with explicit path
config();

/**
 * 1. DATABASE_URL Validation
 * Make sure we fail fast if the env variable is missing.
 */
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "❌ DATABASE_URL is not set. Please configure it in your environment."
  );
}

/**
 * 2. Configure Postgres Client
 * - Use connection pooling (important for serverless environments)
 * - Ensure SSL if running on production (common for hosted DBs)
 */
const client = postgres(DATABASE_URL, {
  max: 10, // Pool up to 10 concurrent connections
  ssl: process.env.NODE_ENV === "production" ? "require" : false,
  idle_timeout: 20, // Close idle connections after 20s
  connect_timeout: 10, // Fail quickly if DB can't connect
});

/**
 * 3. Drizzle ORM Client
 */
export const db = drizzle(client, { schema });

/**
 * 4. (Optional) Health Check Function
 * Useful for debugging in dev or checking DB connection in CI/CD pipelines
 */
export async function checkDatabaseConnection() {
  try {
    await client`SELECT 1`; // Simple ping
    console.log("✅ Database connection successful");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    throw err;
  }
}
