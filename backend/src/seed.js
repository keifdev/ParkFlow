import { pool } from "./db.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SPACES = [
  { id: "P01", floor: "Floor 1", type: "Regular" },
  { id: "P02", floor: "Floor 1", type: "Regular" },
  { id: "P03", floor: "Floor 1", type: "Regular" },
  { id: "P04", floor: "Floor 1", type: "VIP" },
  { id: "P05", floor: "Floor 1", type: "Regular" },
  { id: "P06", floor: "Floor 1", type: "Regular" },
  { id: "P07", floor: "Floor 1", type: "Regular" },
  { id: "P08", floor: "Floor 1", type: "PWD" },
  { id: "P09", floor: "Floor 1", type: "Regular" },
  { id: "P10", floor: "Floor 1", type: "Regular" },
  { id: "P11", floor: "Floor 1", type: "VIP" },
  { id: "P12", floor: "Floor 1", type: "Regular" },
];

async function run() {
  const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);
  console.log("Schema applied");

  for (const s of SPACES) {
    await pool.query(
      `INSERT INTO spaces (id, floor, type) VALUES ($1, $2, $3)`,
      [s.id, s.floor, s.type]
    );
  }
  console.log(`Seeded ${SPACES.length} spaces`);

  await pool.end();
  console.log("Done");
}

run().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});