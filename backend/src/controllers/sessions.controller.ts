import { Request, Response } from "express";
import { pool, Session } from "../db";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

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

  if (studied_on !== undefined && (typeof studied_on !== "string" || !DATE_RE.test(studied_on))) {
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
       VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE), $4)
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

// getsession logic
export async function getSessions(req: Request, res: Response) {
  const { subject_id, from, to } = req.query;
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (subject_id !== undefined) {
    const id = Number(subject_id);
    if (!Number.isInteger(id)) {
      res.status(400).json({ error: "subject_id must be an integer" });
      return;
    }
    params.push(id);
    conditions.push(`s.subject_id = $${params.length}`);
  }

  if (from !== undefined) {
    if (typeof from !== "string" || !DATE_RE.test(from)) {
      res.status(400).json({ error: "from must be YYYY-MM-DD" });
      return;
    }
    params.push(from);
    conditions.push(`s.studied_on >= $${params.length}::date`);
  }

  if (to !== undefined) {
    if (typeof to !== "string" || !DATE_RE.test(to)) {
      res.status(400).json({ error: "to must be YYYY-MM-DD" });
      return;
    }
    params.push(to);
    conditions.push(`s.studied_on >= $${params.length}::date`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const result = await pool.query<Session & { subject_name: string }>(
      `SELECT s.id, s.subject_id, sub.name AS subject_name,
              s.minutes, s.studied_on, s.note, s.created_at
        FROM sessions s
        JOIN subjects sub ON sub.id = s.subject_id
        ${where}
        ORDER BY s.studied_on DESC, s.id DESC`,
      params,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
}

export async function getSummary(req: Request, res: Response) {
  const { from, to } = req.query;

  if ((from === undefined) !== (to === undefined)) {
    res.status(400).json({ error: "provide both from and to, or neither" });
    return;
  }

  if (from !== undefined && (typeof from !== "string" || !DATE_RE.test(from))) {
    res.status(400).json({ error: "from must be YYYY-MM-DD" });
    return;
  }

  if (to !== undefined && (typeof to !== "string" || !DATE_RE.test(to))) {
    res.status(400).json({ error: "to must be YYYY-MM-DD" });
    return;
  }

  try {
    const result = await pool.query<{
      subject_id: number;
      subject_name: string;
      total_minutes: number;
      session_count: number;
    }>(
      `WITH r AS (
        SELECT COALESCE($1::date, date_trunc('week', CURRENT_DATE)::date) AS d_from,
               COALESCE($2::date, (date_trunc('week', CURRENT_DATE) + interval '6 days')::date) AS d_to      
      )
      SELECT sub.id AS subject_id,
             sub.name AS subject_name,
             COALESCE(SUM(s.minutes), 0)::int AS total_minutes,
             COUNT(s.id)::int AS session_count
      FROM subjects sub
      CROSS JOIN r
      LEFT JOIN sessions s
         ON s.subject_id = sub.id
         AND s.studied_on BETWEEN r.d_from AND r.d_to
        GROUP BY sub.id, sub.name
        ORDER BY total_minutes DESC, sub.name`,
      [from ?? null, to ?? null],
    );
    res.json(result.rows);
  } catch (err) {
    const code = (err as { code?: string }).code;
    if (code === "22007" || code === "22008") {
      res.status(400).json({ error: "invalid date" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to fetch summary" });
  }
}
