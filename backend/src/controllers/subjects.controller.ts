import { Request, Response } from "express";
import { pool, Subject } from "../db";

export async function getSubjects(req: Request, res: Response) {
  try {
    const result = await pool.query<Subject>("SELECT * FROM subjects ORDER BY name");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
}

export async function createSubject(req: Request, res: Response) {
  const name: unknown = req.body?.name;

  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const result = await pool.query<Subject>("INSERT INTO subjects (name) VALUES ($1) RETURNING *", [name.trim()]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "Subject already exist" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to create subject" });
  }
}
