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

export async function updateSubject(req: Request, res: Response) {
  const id = Number(req.params.id);
  const name: unknown = req.body?.name;

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  if (typeof name !== "string" || name.trim() === "") {
    res.status(400).json({ error: "name is required" });
    return;
  }

  try {
    const result = await pool.query<Subject>("UPDATE subjects set name = $1 WHERE id = $2 RETURNING *", [
      name.trim(),
      id,
    ]);
    if (result.rows.length === 0) {
      res.status(400).json({ error: "Subject not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "Subject already exist" });
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Failed to update subject" });
  }
}

export async function deleteSubject(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "invalid id" });
    return;
  }

  try {
    const result = await pool.query<Subject>("DELETE FROM subjects WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete subject" });
  }
}
