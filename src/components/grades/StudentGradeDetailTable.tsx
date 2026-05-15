import React from "react";
import { Criterion } from "../../models/Criterion";
import { GradeDetail } from "../../models/GradeDetail";
import { Scale } from "../../models/Scale";

interface StudentGradeDetailTableProps {
  details: GradeDetail[];
  criteria: Criterion[];
  scales: Scale[];
}

const StudentGradeDetailTable: React.FC<StudentGradeDetailTableProps> = ({
  details,
  criteria,
  scales,
}) => {
  const getCriterion = (criterionId: string) =>
    criteria.find((criterion) => criterion.id === criterionId);

  const getScale = (scaleId: string) =>
    scales.find((scale) => scale.id === scaleId);

  const totalObtained = details.reduce(
    (total, detail) => total + Number(detail.score || 0),
    0
  );

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Detalle de tu calificación por criterios
      </h3>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Criterio</th>
              <th className="px-4 py-3">Nivel obtenido</th>
              <th className="px-4 py-3">Puntaje</th>
              <th className="px-4 py-3">Comentario docente</th>
            </tr>
          </thead>

          <tbody>
            {details.map((detail, index) => {
              const criterion = getCriterion(detail.criterion_id);
              const scale = getScale(detail.scale_id);

              return (
                <tr key={detail.id ?? index} className="border-b border-stroke">
                  <td className="px-4 py-4">{index + 1}</td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-black dark:text-white">
                      {criterion?.name ?? "Criterio no encontrado"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Peso: {criterion?.weight ?? 0}%
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <p>{scale?.name ?? "Escala no encontrada"}</p>
                    <p className="text-sm text-gray-500">
                      {scale?.description}
                    </p>
                  </td>

                  <td className="px-4 py-4 font-semibold text-primary">
                    {Number(detail.score).toFixed(2)}
                  </td>

                  <td className="px-4 py-4">
                    {detail.comment || "Sin comentario"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 rounded bg-gray-2 p-4 dark:bg-meta-4">
        <strong>Total obtenido:</strong> {totalObtained.toFixed(2)}
      </div>
    </div>
  );
};

export default StudentGradeDetailTable;