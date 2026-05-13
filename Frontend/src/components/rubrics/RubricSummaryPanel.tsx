import React from "react";
import { RubricCriterionInput } from "../../models/RubricCriterionInput";

interface RubricSummaryPanelProps {
  title: string;
  criteria: RubricCriterionInput[];
}

const RubricSummaryPanel: React.FC<RubricSummaryPanelProps> = ({
  title,
  criteria,
}) => {
  const totalWeight = criteria.reduce(
    (total, criterion) => total + Number(criterion.weight || 0),
    0
  );

  const canPublish =
    criteria.length > 0 &&
    totalWeight === 100 &&
    criteria.every(
      (criterion) =>
        criterion.scales.length >= 2 &&
        criterion.scales.length <= 5
    );

  return (
    <aside className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Resumen de la rúbrica
      </h3>

      <div className="space-y-3 text-sm">
        <p>
          <strong>Título:</strong> {title || "Sin título"}
        </p>

        <p>
          <strong>Criterios:</strong> {criteria.length}
        </p>

        <p>
          <strong>Suma de pesos:</strong>{" "}
          <span className={totalWeight === 100 ? "text-green-600" : "text-red-500"}>
            {totalWeight}%
          </span>
        </p>
      </div>

      <div
        className={`mt-6 rounded border p-4 text-sm ${
          canPublish
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-red-200 bg-red-50 text-red-700"
        }`}
      >
        {canPublish
          ? "Lista para publicar."
          : "No se puede publicar todavía. Debe tener criterios, suma de pesos igual a 100% y entre 2 y 5 escalas por criterio."}
      </div>
    </aside>
  );
};

export default RubricSummaryPanel;