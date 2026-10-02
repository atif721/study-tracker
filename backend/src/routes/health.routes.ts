import { pool } from "../db";
import { Request, Response, Router } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "server ok" });
});

router.get("/db", async (req: Request, res: Response) => {
  try {
    const result = await pool.query<{ time: Date }>("SELECT now() AS time");
    res.json({ db: "ok", time: result.rows[0].time });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "error" });
  }
});

export default router;
