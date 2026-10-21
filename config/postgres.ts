//config/postgres.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.POSTGRES_URI;

if (!connectionString) {
  throw new Error("POSTGRES_URL is not defined in .env");
}

const pool = new Pool({
  connectionString,
  // Most hosted Postgres providers (Render, Railway, Neon, Supabase, Heroku)
  // require SSL. Locally, this stays off.
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PG client error", err);
});

export default pool;
