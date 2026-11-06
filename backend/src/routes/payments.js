import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(
    `SELECT * FROM payments ORDER BY created_at DESC`
  );
  res.json(rows);
});

router.get("/revenue", async (req, res) => {
  const { rows } = await query(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM payments
    WHERE created_at >= CURRENT_DATE
  `);
  res.json({ total: Number(rows[0].total) });
});

// NEW: Fetch recent payments for the activity feed
router.get("/recent", async (req, res) => {
  const { rows } = await query(`
    SELECT id, plate, amount, method, created_at
    FROM payments
    ORDER BY created_at DESC
    LIMIT 10
  `);
  res.json(rows);
});

router.post("/", async (req, res) => {
  const { spaceId, plate, amount, method, sessionId } = req.body;
  if (!amount || !method)
    return res.status(400).json({ error: "amount and method required" });

  const p = await query(
    `INSERT INTO payments (session_id, space_id, plate, amount, method)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [sessionId || null, spaceId || null, plate || null, amount, method]
  );
  res.status(201).json(p.rows[0]);
});

export default router;