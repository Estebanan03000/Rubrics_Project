import React from "react";
import { RubricCriterionInput } from "../../models/RubricCriterionInput";

interface RubricCriteriaEditorProps {
  criteria: RubricCriterionInput[];
  onChange: (criteria: RubricCriterionInput[]) => void;
}

const emptyCriterion = (): RubricCriterionInput => ({
  name: "",
  description: "",
  weight: 0,
});

const RubricCriteriaEditor: React.FC<RubricCriteriaEditorProps> = ({
  criteria,
  onChange,
}) => {
  const totalWeight = criteria.reduce(
    (total, criterion) => total + Number(criterion.weight || 0),
    0
  );

  const updateCriterion = (
    index: number,
    field: keyof RubricCriterionInput,
    value: string | number
  ) => {
    const updated = [...criteria];

    updated[index] = {
      ...updated[index],
      [field]: field === "weight" ? Number(value) : value,
    };

    onChange(updated);
  };

  const addCriterion = () => {
    onChange([...criteria, emptyCriterion()]);
  };

  const removeCriterion = (index: number) => {
    onChange(criteria.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Criterios de evaluación
          </h3>
          <p className="text-sm text-gray-500">
            La suma de los pesos debe ser exactamente 100%.
          </p>
        </div>

        <button
          type="button"
          onClick={addCriterion}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          Agregar criterio
        </button>
      </div>

      {criteria.length === 0 ? (
        <div className="rounded border border-dashed border-stroke p-6 text-center text-gray-500">
          Aún no hay criterios. Agregue al menos uno para poder publicar.
        </div>
      ) : (
        <div className="space-y-4">
          {criteria.map((criterion, index) => (
            <div
              key={index}
              className="rounded border border-stroke p-4 dark:border-strokedark"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-medium text-black dark:text-white">
                  Criterio {index + 1}
                </span>

                <button
                  type="button"
                  onClick={() => removeCriterion(index)}
                  className="text-sm text-red-500"
                >
                  Eliminar
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Nombre
                  </label>

                  <input
                    type="text"
                    value={criterion.name}
                    onChange={(event) =>
                      updateCriterion(index, "name", event.target.value)
                    }
                    className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Descripción
                  </label>

                  <input
                    type="text"
                    value={criterion.description}
                    onChange={(event) =>
                      updateCriterion(index, "description", event.target.value)
                    }
                    className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                    Peso (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={criterion.weight}
                    onChange={(event) =>
                      updateCriterion(index, "weight", event.target.value)
                    }
                    className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 rounded bg-gray-2 p-4 dark:bg-meta-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-black dark:text-white">
            Suma total de pesos
          </span>

          <span
            className={`text-xl font-bold ${
              totalWeight === 100 ? "text-green-600" : "text-red-500"
            }`}
          >
            {totalWeight}%
          </span>
        </div>

        {totalWeight === 100 ? (
          <p className="mt-1 text-sm text-green-600">
            La suma de los pesos es correcta.
          </p>
        ) : (
          <p className="mt-1 text-sm text-red-500">
            La rúbrica solo puede publicarse cuando la suma sea 100%.
          </p>
        )}
      </div>
    </div>
  );
};

export default RubricCriteriaEditor;