import { useState } from "react";
import type { SubmitEvent } from "react";

interface SubjectFormProps {
  onAdd: (name: string) => Promise<void>;
}

const SubjectForm = ({ onAdd }: SubjectFormProps) => {
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      await onAdd(trimmed);
      setName("");
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="mb-6" action="#">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New subject name "
          className="flex-1 rounded border border-gray-300 bg-white p-2"
        />
        <button
          type="submit"
          disabled={submitting || name.trim() === ""}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50">
          {submitting ? "Adding" : "Add"}
        </button>
      </div>
      {formError && <p className="mt-2 text-red-600">{formError}</p>}
    </form>
  );
};

export default SubjectForm;
