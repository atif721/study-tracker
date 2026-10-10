import SubjectForm from "./components/SubjectForm";
import SubjectList from "./components/SubjectList";
import { useSubjects } from "./hooks/useSubjects";

const App = () => {
  const { subjects, loading, error, addSubject } = useSubjects();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-xl">
        <h1 className="mb-6 text-3xl font-bold text-blue-600">Study Tracker</h1>

        <SubjectForm onAdd={addSubject} />
        <SubjectList subjects={subjects} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default App;
