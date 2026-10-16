import { useState, type SubmitEvent } from "react";
import type { Subject, NewSession } from "../utils/types";
import { toLocalISODate } from "../utils/dates";

interface SessionFormProps {
  subjects: Subject[];
  onAdd: (input: NewSession) => Promise<void>;
}

const SessionForm = ({ subjects, onAdd }: SessionFormProps) => {
  const [subjectId, setSubjectId] = useState("");
  const [minutes, setMinutes] = useState("");
  const [studiedOn, setStudiedOn] = useState(() => toLocalISODate());
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const minutesNum = Number(minutes);

  const isValid =
    subjectId !== "" &&
    Number.isInteger(minutesNum) &&
    minutesNum > 0 &&
    studiedOn !== "";

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValid) return;

    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        subject_id: Number(subjectId),
        minutes: minutesNum,
        studied_on: studiedOn,
        note: note.trim() || undefined,
      });
      setMinutes("");
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass = "rounded border border-gray-300 bg-white p-2";

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <h1 className="mb-3 text-xl font-semibold">Log a session</h1>

      {subjects.length === 0 ? (
        <p className="text-gray-500">Add a subject First</p>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className={`flex-1 ${inputClass}`}
            >
              <option value="">Select subject</option>
              {subjects.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              step={1}
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="Minutes"
              className={`w-28 ${inputClass}`}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={studiedOn}
              max={toLocalISODate()}
              onChange={(e) => setStudiedOn(e.target.value)}
              className={inputClass}
            />
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Note (optional)"
              className={`flex-1 ${inputClass}`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !isValid}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? "Logging..." : "Log Session"}
          </button>
        </div>
      )}
      {error && <p className="mt-2 text-red-600"> {error} </p>}
    </form>
  );
};

export default SessionForm;
