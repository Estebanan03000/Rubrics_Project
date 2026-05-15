import React from "react";
import { Evaluation } from "../../models/Evaluation";
import { GradeFormData } from "../../models/GradeFormData";
import { Student } from "../../models/Student";
import { gradingBusiness } from "../../business/gradingBusiness";

interface GradeSummaryPanelProps {
  evaluation: Evaluation;
  student: Student;
  formData: GradeFormData;
}

const GradeSummaryPanel: React.FC<GradeSummaryPanelProps> = ({
  evaluation,
  student,
  formData,
}) => {
  const finalScore = gradingBusiness.calculateFinalScore(formData);

  const completed = formData.criteria.filter(
    (item) => item.selected_scale_id
  ).length;

  const total = formData.criteria.length;

  return (
    <aside className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Resumen de la calificación
      </h3>

      <div className="space-y-3 text-sm">
        <p>
          <strong>Evaluación:</strong> {evaluation.name}
        </p>

        <p>
          <strong>Estudiante:</strong>{" "}
          {`${student.first_name ?? ""} ${student.last_name ?? ""}`.trim()}
        </p>

        <p>
          <strong>Criterios completos:</strong> {completed} de {total}
        </p>

        <p>
          <strong>Ponderación evaluación:</strong> {evaluation.weight}%
        </p>
      </div>

      <div className="mt-6 rounded bg-gray-2 p-4 text-center dark:bg-meta-4">
        <p className="text-sm text-gray-500">Nota final calculada</p>
        <p className="text-3xl font-bold text-primary">
          {finalScore.toFixed(2)} / 100
        </p>
      </div>

      <div
        className={`mt-4 rounded border p-3 text-sm ${
          completed === total
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {completed === total
          ? "La calificación está completa y puede enviarse."
          : "Faltan criterios por calificar. Puede guardar borrador."}
      </div>
    </aside>
  );
};

export default GradeSummaryPanel;