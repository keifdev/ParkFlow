import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ping } from "./db.js";
import spacesRouter from "./routes/spaces.js";
import sessionsRouter from "./routes/sessions.js";
import reservationsRouter from "./routes/reservations.js";
import paymentsRouter from "./routes/payments.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (req, res) => {
  try {
    const now = await ping();
    res.json({ ok: true, db: "connected", now });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

app.use("/api/spaces", spacesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/reservations", reservationsRouter);
app.use("/api/payments", paymentsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`ParkFlow API listening on http://localhost:${PORT}`);
});