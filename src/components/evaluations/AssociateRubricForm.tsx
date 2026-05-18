import { useState } from 'react';

import { Evaluation } from '../../models/Evaluation';
import { Rubric } from '../../models/Rubric';
import { Subject } from '../../models/Subject';

interface Props {
  evaluations: Evaluation[];
  rubrics: Rubric[];
  subjects: Subject[];
  onSubmit: (
    evaluationId: string,
    rubricId: string,
    subjectId: string,
  ) => void;
}

export default function AssociateRubricForm({
  evaluations,
  rubrics,
  subjects,
  onSubmit,
}: Props) {
  const [evaluationId, setEvaluationId] = useState('');
  const [rubricId, setRubricId] = useState('');
  const [subjectId, setSubjectId] = useState('');

  return (
    <form
      className="mx-auto max-w-xl space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(evaluationId, rubricId, subjectId);
      }}
    >
      <select
        className="w-full rounded border px-3 py-2 text-sm"
        value={evaluationId}
        onChange={(e) => setEvaluationId(e.target.value)}
      >
        <option value="">Seleccione evaluación</option>

        {evaluations.map((evaluation) => (
          <option key={evaluation.id} value={evaluation.id}>
            {evaluation.name || evaluation.id}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded border px-3 py-2 text-sm"
        value={rubricId}
        onChange={(e) => setRubricId(e.target.value)}
      >
        <option value="">Seleccione rúbrica pública</option>

        {rubrics.map((rubric) => (
          <option key={rubric.id} value={rubric.id}>
            {rubric.name || rubric.id}
          </option>
        ))}
      </select>

      <select
        className="w-full rounded border px-3 py-2 text-sm"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
      >
        <option value="">Seleccione asignatura</option>

        {subjects.map((subject) => (
          <option key={subject.id} value={subject.id}>
            {subject.name || subject.code}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded bg-primary px-5 py-2 text-sm text-white"
      >
        Asociar rúbrica
      </button>
    </form>
  );
}