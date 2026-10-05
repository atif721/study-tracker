import { Request, Response } from "express";
import { pool, Session } from "../db";

export async function createSession(req: Request, res: Response) {
  const { subject_id, minutes, studied_on, note } = req.body ?? {};

  // 4 validation checking
  if (!Number.isInteger(subject_id)) {
    res.status(400).json({ error: "subject_id must be an integer" });
    return;
  }

  if (!Number.isInteger(minutes) || minutes <= 0) {
    res.status(400).json({ error: "minutes must be a positive integer" });
    return;
  }

  if ((studied_on !== undefined && typeof studied_on !== "string") || !/^\d{4}-\d{2}-\d{2}$/.test(studied_on)) {
    res.status(400).json({ error: "studied_on must be YYYY-MM-DD" });
    return;
  }

  if (note !== undefined && typeof note !== "string") {
    res.status(400).json({ error: "note must be string" });
  }

  // insert into database logic
  try {
    const result = await pool.query<Session>(
      `INSERT INTO sessions (subject_id, minutes, studied_on, note)
       VALUES ($1 $2 COELESCE($3::date, CURRENT_DATE), $4)
       RETURNING *`,
      [subject_id, minutes, studied_on ?? null, note ?? null],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    const code = (err as { code?: string }).code;
    // 23503 = foreign key violation (subject doesn't exist)
    if (code === "23503") {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    // 22007 / 22008 = invalid date like 2026-13-45
    if (code === "22007" || code === "22008") {
      res.status(400).json({ error: "studied_on is not a valid date" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create session" });
  }
}
