import type { Subject } from "../types";

interface SubjectListProps {
  subjects: Subject[];
  loading: boolean;
  error: string | null;
}

const SubjectList = ({ subjects, loading, error }: SubjectListProps) => {
  return (
    <>
      <h2 className="mb-3 text-xl font-semibold">Subjects</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && subjects.length === 0 && <p className="text-gray-500">No subjects yet</p>}

      <ul className="space-y-2">
        {subjects.map((subject) => (
          <li key={subject.id} className="rounded bg-white p-3 shadow">
            {subject.name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default SubjectList;
