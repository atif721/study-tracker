import { useEffect, useState } from "react";
import type { Subject } from "./types";
import { getSubjects } from "./api";

const App = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSubjects()
      .then(setSubjects)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">Study Tracker</h1>

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
      </div>
    </div>
  );
};

export default App;
