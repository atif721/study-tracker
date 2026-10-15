export interface Subject {
  id: number;
  name: string;
  created_at: string;
}

export interface Session {
  id: number;
  subject_id: number;
  subject_name: string;
  minutes: number;
  studied_on: string; // "YYYY-MM-DD"
  note: string | null;
  created_at: string;
}

export interface NewSession {
  subject_id: number;
  minutes: number;
  studied_on?: string;
  note?: string;
}

export type CreatedSession = Omit<Session, "subject_name">;

export interface SummaryRow {
  subject_id: number;
  subject_name: string;
  total_minutes: number;
  session_count: number;
}
