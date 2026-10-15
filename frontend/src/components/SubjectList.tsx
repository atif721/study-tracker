import { useState } from "react";
import type { Subject } from "../utils/types";

interface SubjectListProps {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => Promise<void>;
}

const SubjectList = ({
  subjects,
  loading,
  error,
  onDelete,
}: SubjectListProps) => {
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  async function handleDelete(subject: Subject) {
    if (!window.confirm(`Delete "${subject.name}" and all its sessions?`)) {
      return;
    }

    setDeletingId(subject.id);
    setDeleteError(null);

    try {
      await onDelete(subject.id);
    } catch (err) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <h2 className="mb-3 text-xl font-semibold">Subjects</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {deleteError && <p className="mb-2 text-red-600">{deleteError}</p>}

      {!loading && !error && subjects.length === 0 && (
        <p className="text-gray-500">No subjects yet</p>
      )}

      <ul className="space-y-2">
        {subjects.map((subject) => (
          <li
            key={subject.id}
            className="flex items-center justify-between rounded bg-white p-3 shadow"
          >
            <span>{subject.name}</span>
            <button
              className="cursor-pointer text-sm text-red-600 hover:underline disabled:opacity-50"
              disabled={deletingId === subject.id}
              onClick={() => handleDelete(subject)}
            >
              {deletingId === subject.id ? "Deleting..." : "Delete"}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SubjectList;
