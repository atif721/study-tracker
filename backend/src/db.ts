import { Pool, types } from "pg";

// 1082 = Postgres DATE type; return it as a "YYYY-MM-DD" string
types.setTypeParser(1082, (value) => value);

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
