import React from "react";
import { RubricCriterionInput } from "../../models/RubricCriterionInput";
import { ScaleInput } from "../../models/ScaleInput";

interface RubricCriteriaEditorProps {
  criteria: RubricCriterionInput[];
  onChange: (criteria: RubricCriterionInput[]) => void;
}

const emptyCriterion = (): RubricCriterionInput => ({
  name: "",
  description: "",
  weight: 0,
  scales: [],
});

const emptyScale = (): ScaleInput => ({
  name: "",
  description: "",
  value: 0,
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

  const addScale = (criterionIndex: number) => {
    const updated = [...criteria];

    if (updated[criterionIndex].scales.length >= 5) {
      return;
    }

    updated[criterionIndex] = {
      ...updated[criterionIndex],
      scales: [...updated[criterionIndex].scales, emptyScale()],
    };

    onChange(updated);
  };

  const updateScale = (
    criterionIndex: number,
    scaleIndex: number,
    field: "name" | "description" | "value",
    value: string | number
  ) => {
    const updated = [...criteria];
    const updatedScales = [...updated[criterionIndex].scales];

    updatedScales[scaleIndex] = {
      ...updatedScales[scaleIndex],
      [field]: field === "value" ? Number(value) : value,
    };

    updated[criterionIndex] = {
      ...updated[criterionIndex],
      scales: updatedScales,
    };

    onChange(updated);
  };

  const removeScale = (criterionIndex: number, scaleIndex: number) => {
    const updated = [...criteria];

    updated[criterionIndex] = {
      ...updated[criterionIndex],
      scales: updated[criterionIndex].scales.filter(
        (_, index) => index !== scaleIndex
      ),
    };

    onChange(updated);
  };

  const getDuplicatedScaleValues = (criterion: RubricCriterionInput) => {
    const values = criterion.scales.map((scale) => Number(scale.value));
    return values.filter((value, index) => values.indexOf(value) !== index);
  };

  const isDuplicatedScaleValue = (
    criterion: RubricCriterionInput,
    value: number
  ) => {
    return criterion.scales.filter((scale) => Number(scale.value) === value)
      .length > 1;
  };

  const getReusableScales = (criterionIndex: number) => {
    return criteria.flatMap((criterion, currentCriterionIndex) =>
      criterion.scales
        .filter(
          (scale) =>
            currentCriterionIndex !== criterionIndex &&
            scale.name.trim() &&
            scale.description.trim() &&
            Number(scale.value) > 0
        )
        .map((scale, scaleIndex) => ({
          label: `${criterion.name || `Criterio ${currentCriterionIndex + 1}`} - ${
            scale.name
          } (${scale.value})`,
          criterionIndex: currentCriterionIndex,
          scaleIndex,
          scale,
        }))
    );
  };

  const reuseScale = (criterionIndex: number, reuseKey: string) => {
    if (!reuseKey) return;

    const [sourceCriterionIndex, sourceScaleIndex] = reuseKey
      .split("-")
      .map(Number);

    const sourceScale =
      criteria[sourceCriterionIndex]?.scales[sourceScaleIndex];

    if (!sourceScale) return;

    const updated = [...criteria];

    if (updated[criterionIndex].scales.length >= 5) {
      return;
    }

    updated[criterionIndex] = {
      ...updated[criterionIndex],
      scales: [
        ...updated[criterionIndex].scales,
        {
          name: sourceScale.name,
          description: sourceScale.description,
          value: Number(sourceScale.value),
        },
      ],
    };

    onChange(updated);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-black dark:text-white">
            Criterios de evaluación
          </h3>
          <p className="text-sm text-gray-500">
            Define criterios y niveles de escala. La suma de los pesos debe ser
            exactamente 100%.
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
        <div className="space-y-5">
          {criteria.map((criterion, index) => {
            const duplicatedValues = getDuplicatedScaleValues(criterion);
            const reusableScales = getReusableScales(index);

            return (
              <div
                key={index}
                className="rounded border border-stroke p-4 dark:border-strokedark"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-black dark:text-white">
                      Criterio {index + 1}
                    </span>
                    <p className="text-xs text-gray-500">
                      Cada criterio debe tener entre 2 y 5 niveles de escala.
                    </p>
                  </div>

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

                <div className="mt-5 rounded border border-stroke bg-gray-2 p-4 dark:border-strokedark dark:bg-meta-4">
                  <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h4 className="font-medium text-black dark:text-white">
                        Escalas del criterio
                      </h4>
                      <p className="text-sm text-gray-500">
                        Cada nivel debe tener etiqueta, descripción y valor
                        numérico único.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <select
                        defaultValue=""
                        onChange={(event) => {
                          reuseScale(index, event.target.value);
                          event.target.value = "";
                        }}
                        disabled={reusableScales.length === 0 || criterion.scales.length >= 5}
                        className="rounded border border-stroke px-3 py-2 text-sm dark:border-strokedark dark:bg-form-input"
                      >
                        <option value="">Reutilizar escala existente</option>
                        {reusableScales.map((item) => (
                          <option
                            key={`${item.criterionIndex}-${item.scaleIndex}`}
                            value={`${item.criterionIndex}-${item.scaleIndex}`}
                          >
                            {item.label}
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => addScale(index)}
                        disabled={criterion.scales.length >= 5}
                        className="rounded bg-primary px-3 py-2 text-sm text-white disabled:bg-gray-400"
                      >
                        Agregar escala
                      </button>
                    </div>
                  </div>

                  {criterion.scales.length === 0 ? (
                    <p className="rounded border border-dashed border-red-300 p-4 text-sm text-red-500">
                      Este criterio todavía no tiene escalas.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {criterion.scales.map((scale, scaleIndex) => {
                        const duplicated = isDuplicatedScaleValue(
                          criterion,
                          Number(scale.value)
                        );

                        return (
                          <div
                            key={scaleIndex}
                            className="rounded border border-stroke bg-white p-4 dark:border-strokedark dark:bg-boxdark"
                          >
                            <div className="mb-3 flex items-center justify-between">
                              <span className="text-sm font-medium text-black dark:text-white">
                                Nivel {scaleIndex + 1}
                              </span>

                              <button
                                type="button"
                                onClick={() => removeScale(index, scaleIndex)}
                                className="rounded border border-red-500 px-3 py-1 text-sm text-red-500"
                              >
                                Eliminar
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-6">
                              <div className="lg:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                  Nombre / etiqueta
                                </label>

                                <input
                                  type="text"
                                  value={scale.name}
                                  onChange={(event) =>
                                    updateScale(
                                      index,
                                      scaleIndex,
                                      "name",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Ej: Excelente"
                                  className="w-full rounded border border-stroke px-3 py-2 dark:border-strokedark dark:bg-form-input"
                                />
                              </div>

                              <div className="lg:col-span-3">
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                  Descripción
                                </label>

                                <textarea
                                  value={scale.description}
                                  onChange={(event) =>
                                    updateScale(
                                      index,
                                      scaleIndex,
                                      "description",
                                      event.target.value
                                    )
                                  }
                                  placeholder="Describe el desempeño esperado"
                                  rows={2}
                                  className="w-full rounded border border-stroke px-3 py-2 dark:border-strokedark dark:bg-form-input"
                                />
                              </div>

                              <div>
                                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                                  Valor
                                </label>

                                <input
                                  type="number"
                                  min="0"
                                  value={scale.value}
                                  onChange={(event) =>
                                    updateScale(
                                      index,
                                      scaleIndex,
                                      "value",
                                      event.target.value
                                    )
                                  }
                                  placeholder="100"
                                  className={`w-full rounded border px-3 py-2 dark:bg-form-input ${
                                    duplicated
                                      ? "border-red-500"
                                      : "border-stroke dark:border-strokedark"
                                  }`}
                                />

                                {duplicated && (
                                  <p className="mt-1 text-xs text-red-500">
                                    Valor repetido.
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="mt-4 rounded border border-stroke bg-white p-3 text-sm dark:border-strokedark dark:bg-boxdark">
                    {criterion.scales.length < 2 && (
                      <p className="text-red-500">
                        Este criterio necesita mínimo 2 escalas para poder
                        publicar.
                      </p>
                    )}

                    {criterion.scales.length >= 2 &&
                      criterion.scales.length <= 5 &&
                      duplicatedValues.length === 0 && (
                        <p className="text-green-600">
                          Este criterio tiene una cantidad válida de escalas.
                        </p>
                      )}

                    {duplicatedValues.length > 0 && (
                      <p className="text-red-500">
                        Hay valores duplicados dentro de este criterio.
                      </p>
                    )}

                    {criterion.scales.length >= 5 && (
                      <p className="text-gray-500">
                        Ya alcanzaste el máximo de 5 escalas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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