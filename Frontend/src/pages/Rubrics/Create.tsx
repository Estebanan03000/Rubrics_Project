import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import StepIndicator from "../../components/workflow/StepIndicator";
import RubricBasicForm from "../../components/rubrics/RubricBasicForm";
import RubricCriteriaEditor from "../../components/rubrics/RubricCriteriaEditor";
import RubricSummaryPanel from "../../components/rubrics/RubricSummaryPanel";

import { rubricBusiness } from "../../business/rubricBusiness";
import { RubricCriterionInput } from "../../models/RubricCriterionInput";
import { RubricFormData } from "../../models/RubricFormData";

const CreateRubric: React.FC = () => {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<RubricFormData>({
    title: "",
    description: "",
    criteria: [],
  });

  const handleBasicChange = (
    field: "title" | "description",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCriteriaChange = (criteria: RubricCriterionInput[]) => {
    setFormData((prev) => ({
      ...prev,
      criteria,
    }));
  };

  const totalWeight = formData.criteria.reduce(
    (total, criterion) => total + Number(criterion.weight || 0),
    0
  );

  const validateStepOne = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      await Swal.fire(
        "Campos incompletos",
        "Debe ingresar título y descripción.",
        "warning"
      );

      return false;
    }

    return true;
  };

  const goNext = async () => {
    if (currentStep === 1) {
      const valid = await validateStepOne();
      if (!valid) return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const created = await rubricBusiness.createRubric(formData, false);

      if (created) {
        await Swal.fire(
          "Borrador guardado",
          "La rúbrica fue guardada como borrador.",
          "success"
        );

        navigate("/rubrics/list");
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo guardar la rúbrica.",
        "error"
      );
    }
  };

  const handlePublish = async () => {
    try {
      const created = await rubricBusiness.createRubric(formData, true);

      if (created) {
        await Swal.fire(
          "Rúbrica publicada",
          "La rúbrica fue publicada correctamente.",
          "success"
        );

        navigate("/rubrics/list");
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo publicar la rúbrica.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader
        title="Crear rúbrica de evaluación"
        description="Diseña los criterios y asigna pesos porcentuales para tu rúbrica."
      />

      <StepIndicator
        currentStep={currentStep}
        steps={[
          { number: 1, label: "Información de la rúbrica" },
          { number: 2, label: "Criterios" },
          { number: 3, label: "Revisión" },
          { number: 4, label: "Publicar o guardar" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {currentStep === 1 && (
            <RubricBasicForm
              title={formData.title}
              description={formData.description}
              onChange={handleBasicChange}
            />
          )}

          {currentStep === 2 && (
            <RubricCriteriaEditor
              criteria={formData.criteria}
              onChange={handleCriteriaChange}
            />
          )}

          {currentStep === 3 && (
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Revisión de criterios
              </h3>

              {formData.criteria.length === 0 ? (
                <p className="text-sm text-red-500">
                  La rúbrica no tiene criterios. Puede guardarse como borrador,
                  pero no publicarse.
                </p>
              ) : (
                <div className="space-y-3">
                  {formData.criteria.map((criterion, index) => (
                    <div
                      key={index}
                      className="rounded border border-stroke p-4 dark:border-strokedark"
                    >
                      <p className="font-medium text-black dark:text-white">
                        {index + 1}. {criterion.name || "Sin nombre"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {criterion.description || "Sin descripción"}
                      </p>
                      <p className="mt-2 text-sm">
                        Peso: <strong>{criterion.weight}%</strong>
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 rounded bg-gray-2 p-4 dark:bg-meta-4">
                <strong>Total:</strong> {totalWeight}%
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Publicar o guardar
              </h3>

              <p className="mb-6 text-sm text-gray-500">
                Puede guardar la rúbrica como borrador o publicarla si cumple
                todas las reglas.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="rounded border border-stroke px-4 py-2"
                >
                  Guardar como borrador
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={formData.criteria.length === 0 || totalWeight !== 100}
                  className="rounded bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  Publicar rúbrica
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() =>
                currentStep === 1 ? navigate("/rubrics/list") : goBack()
              }
              className="rounded border border-stroke px-4 py-2"
            >
              {currentStep === 1 ? "Cancelar" : "Atrás"}
            </button>

            {currentStep < 4 && (
              <button
                type="button"
                onClick={goNext}
                className="rounded bg-primary px-4 py-2 text-white"
              >
                Continuar
              </button>
            )}
          </div>
        </div>

        <RubricSummaryPanel
          title={formData.title}
          criteria={formData.criteria}
        />
      </div>
    </>
  );
};

export default CreateRubric;