import React from "react";
import { Subject } from "../../models/Subject";

interface RubricBasicFormProps {
  subjectId: string;
  title: string;
  description: string;
  subjects: Subject[];
  onChange: (field: "subject_id" | "title" | "description", value: string) => void;
}

const RubricBasicForm: React.FC<RubricBasicFormProps> = ({
  subjectId,
  title,
  description,
  subjects,
  onChange,
}) => {
  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Información de la rúbrica
      </h3>

      <div className="mb-4">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Asignatura
        </label>

        <select
          value={subjectId}
          onChange={(event) => onChange("subject_id", event.target.value)}
          className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        >
          <option value="">Seleccione una asignatura</option>
          {subjects.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name} ({subject.code})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-2 block font-medium text-black dark:text-white">
          Título
        </label>

        <input
          type="text"
          value={title}
          onChange={(event) => onChange("title", event.target.value)}
          className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-black dark:text-white">
          Descripción
        </label>

        <textarea
          value={description}
          onChange={(event) => onChange("description", event.target.value)}
          className="min-h-[120px] w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
        />
      </div>
    </div>
  );
};

export default RubricBasicForm;