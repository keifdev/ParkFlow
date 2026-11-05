import { Router } from "express";
import { query } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { rows } = await query(`
    SELECT
      s.id,
      s.floor,
      s.type,
      s.status,
      sess.plate AS plate,
      sess.entered_at
    FROM spaces s
    LEFT JOIN sessions sess
      ON sess.space_id = s.id AND sess.status = 'active'
    ORDER BY s.id
  `);
  res.json(rows);
});

export default router;