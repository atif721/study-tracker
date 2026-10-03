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
