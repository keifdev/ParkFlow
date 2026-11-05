import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes("sslmode=require")
    ? { rejectUnauthorized: false }
    : false,
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result;
}

export async function ping() {
  const r = await pool.query("SELECT NOW() as now");
  return r.rows[0].now;
}