import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Subject {
  id: number;
  name: string;
  created_at: Date;
}

export interface Session {
  id: number;
  subject_id: number;
  minutes: number;
  studied_on: string;
  note: string | null;
  created_at: Date;
}
