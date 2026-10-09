import { useEffect, useState } from "react";
import { createSubject, getSubjects, deleteSubject } from "../api";
import type { Subject } from "../types";

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function addSubject(name: string) {
    const created = await createSubject(name);

    setSubjects((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
  }

  async function removeSubject(id: number) {
    await deleteSubject(id);
    setSubjects((prev) => prev.filter((s) => s.id !== id));
  }

  return [subjects, loading, error, addSubject, removeSubject];
}
