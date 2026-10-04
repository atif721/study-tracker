import { Request, Response } from "express";
import { pool, Session } from "../db";

export async function createSession(req: Request, res: Response) {
  const { subject_id, minutes, studied_on, note } = req.body ?? {};

  if (!Number.isInteger(subject_id)) {
    res.status(400).json({ error: "subject_id must be an integer" });
    return;
  }

  if (!Number.isInteger(minutes) || minutes <= 0) {
    res.status(400).json({ error: "minutes must be a positive integer" });
    return;
  }

  
}
