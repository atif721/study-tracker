import { useEffect, useState } from "react";
import {
  getSessions,
  createSession,
  deleteSession,
  getSummary,
} from "../utils/api";
import { getCurrentWeekRange } from "../utils/dates";
import type { Session, NewSession, SummaryRow } from "../utils/types";

async function fetchAll() {
  const { from, to } = getCurrentWeekRange();
  const [sessions, summary] = await Promise.all([
    getSessions(),
    getSummary(from, to),
  ]);
  return { sessions, summary };
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [summary, setSummary] = useState<SummaryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAll()
      .then((data) => {
        if (cancelled) return;
        setSessions(data.sessions);
        setSummary(data.summary);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function refresh() {
    const data = await fetchAll();
    setSessions(data.sessions);
    setSummary(data.summary);
  }

  async function addSession(input: NewSession) {
    try {
      await createSession(input);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add session");
    }
  }

  async function removeSession(id: number) {
    try {
      await deleteSession(id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete session");
    }
  }

  return {
    sessions,
    summary,
    loading,
    error,
    refresh,
    addSession,
    removeSession,
  };
}
