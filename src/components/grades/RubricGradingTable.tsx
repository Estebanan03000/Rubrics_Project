import React from "react";
import { GradeFormData } from "../../models/GradeFormData";
import { gradingBusiness } from "../../business/gradingBusiness";

interface RubricGradingTableProps {
  formData: GradeFormData;
  onChange: (data: GradeFormData) => void;
}

const RubricGradingTable: React.FC<RubricGradingTableProps> = ({
  formData,
  onChange,
}) => {
  const handleScaleChange = (criterionId: string, scaleId: string) => {
    onChange(
      gradingBusiness.updateCriterionSelection(formData, criterionId, scaleId)
    );
  };

  const handleCommentChange = (criterionId: string, comment: string) => {
    onChange(
      gradingBusiness.updateCriterionComment(formData, criterionId, comment)
    );
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
        Criterios de la rúbrica
      </h3>

      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Criterio</th>
              <th className="px-4 py-3">Nivel de desempeño</th>
              <th className="px-4 py-3">Puntaje</th>
              <th className="px-4 py-3">Comentario</th>
            </tr>
          </thead>

          <tbody>
            {formData.criteria.map((item, index) => (
              <tr key={item.criterion.id} className="border-b border-stroke">
                <td className="px-4 py-4">{index + 1}</td>

                <td className="px-4 py-4">
                  <p className="font-medium text-black dark:text-white">
                    {item.criterion.name} ({item.criterion.weight}%)
                  </p>
                  <p className="text-sm text-gray-500">
                    {item.criterion.description}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <select
                    value={item.selected_scale_id}
                    onChange={(event) =>
                      handleScaleChange(
                        item.criterion.id ?? "",
                        event.target.value
                      )
                    }
                    className="w-full rounded border border-stroke px-3 py-2 dark:border-strokedark dark:bg-form-input"
                  >
                    <option value="">Seleccione escala</option>
                    {item.scales.map((scale) => (
                      <option key={scale.id} value={scale.id}>
                        {scale.name} ({scale.value})
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-4">
                  <span className="font-semibold text-primary">
                    {item.score.toFixed(2)}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <textarea
                    value={item.comment}
                    onChange={(event) =>
                      handleCommentChange(
                        item.criterion.id ?? "",
                        event.target.value
                      )
                    }
                    className="min-h-[70px] w-full rounded border border-stroke px-3 py-2 dark:border-strokedark dark:bg-form-input"
                    placeholder="Comentario opcional"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded bg-gray-2 p-3 text-sm text-gray-600 dark:bg-meta-4">
        El puntaje de cada criterio se calcula como: valor de escala × peso del
        criterio.
      </p>
    </div>
  );
};

export default RubricGradingTable;