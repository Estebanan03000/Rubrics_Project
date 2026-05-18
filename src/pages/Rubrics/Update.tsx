import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import RubricBasicForm from "../../components/rubrics/RubricBasicForm";
import RubricCriteriaEditor from "../../components/rubrics/RubricCriteriaEditor";
import RubricSummaryPanel from "../../components/rubrics/RubricSummaryPanel";

import { Rubric } from "../../models/Rubric";
import { Criterion } from "../../models/Criterion";
import { Scale } from "../../models/Scale";
import { RubricCriterionInput } from "../../models/RubricCriterionInput";
import { RubricFormData } from "../../models/RubricFormData";

import { rubricService } from "../../services/rubricService";
import { criterionService } from "../../services/criterionService";
import { scaleService } from "../../services/scaleService";

const UpdateRubric: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [originalCriteria, setOriginalCriteria] = useState<RubricCriterionInput[]>([]);

  const [formData, setFormData] = useState<RubricFormData>({
    title: "",
    description: "",
    criteria: [],
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const mapCriteriaWithScales = (
    criteria: Criterion[],
    scales: Scale[]
  ): RubricCriterionInput[] => {
    return criteria.map((criterion) => ({
      id: criterion.id,
      name: criterion.name,
      description: criterion.description,
      weight: criterion.weight,
      scales: scales
        .filter((scale) => scale.criterion_id === criterion.id)
        .map((scale) => ({
          id: scale.id,
          name: scale.name,
          description: scale.description,
          value: scale.value,
        })),
    }));
  };

  const loadData = async () => {
    if (!id) return;

    const [rubricResponse, criteriaResponse, scalesResponse] = await Promise.all([
      rubricService.getRubricById(id),
      criterionService.getCriteriaByRubricId(id),
      scaleService.getScales(),
    ]);

    if (!rubricResponse) {
      await Swal.fire("Error", "No se encontró la rúbrica.", "error");
      navigate("/rubrics/list");
      return;
    }

    const mappedCriteria = mapCriteriaWithScales(criteriaResponse, scalesResponse);

    setRubric(rubricResponse);
    setOriginalCriteria(mappedCriteria);

    setFormData({
      title: rubricResponse.title ?? "",
      description: rubricResponse.description ?? "",
      criteria: mappedCriteria,
    });
  };

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

  const validateBeforePublish = () => {
    if (!formData.title.trim()) {
      throw new Error("El título de la rúbrica es obligatorio.");
    }

    if (!formData.description.trim()) {
      throw new Error("La descripción de la rúbrica es obligatoria.");
    }

    if (formData.criteria.length === 0) {
      throw new Error("No se puede publicar una rúbrica sin criterios.");
    }

    const totalWeight = formData.criteria.reduce(
      (total, criterion) => total + Number(criterion.weight || 0),
      0
    );

    if (totalWeight !== 100) {
      throw new Error(
        `La suma de pesos debe ser 100%. Actualmente es ${totalWeight}%.`
      );
    }

    for (const criterion of formData.criteria) {
      if (!criterion.name.trim() || !criterion.description.trim()) {
        throw new Error("Todos los criterios deben tener nombre y descripción.");
      }

      if (Number(criterion.weight) <= 0) {
        throw new Error("Todos los criterios deben tener peso mayor a cero.");
      }

      if (criterion.scales.length < 2 || criterion.scales.length > 5) {
        throw new Error(
          `El criterio "${criterion.name}" debe tener entre 2 y 5 escalas.`
        );
      }

      const values = criterion.scales.map((scale) => Number(scale.value));
      const hasDuplicatedValues = new Set(values).size !== values.length;

      if (hasDuplicatedValues) {
        throw new Error(
          `El criterio "${criterion.name}" tiene valores de escala repetidos.`
        );
      }

      const hasInvalidScale = criterion.scales.some(
        (scale) =>
          !scale.name.trim() ||
          !scale.description.trim() ||
          Number(scale.value) <= 0
      );

      if (hasInvalidScale) {
        throw new Error(
          `Todas las escalas del criterio "${criterion.name}" deben tener nombre, descripción y valor mayor a cero.`
        );
      }
    }
  };

  const syncCriteriaAndScales = async () => {
    if (!id) return;

    const currentCriterionIds = formData.criteria
      .map((criterion) => criterion.id)
      .filter(Boolean);

    const criteriaToDelete = originalCriteria.filter(
      (criterion) => criterion.id && !currentCriterionIds.includes(criterion.id)
    );

    for (const criterion of criteriaToDelete) {
      if (criterion.id) {
        await criterionService.deleteCriterion(criterion.id);
      }
    }

    for (const criterion of formData.criteria) {
      let criterionId = criterion.id;

      if (criterionId) {
        await criterionService.updateCriterion(criterionId, {
          rubric_id: id,
          name: criterion.name.trim(),
          description: criterion.description.trim(),
          weight: Number(criterion.weight),
        });
      } else {
        const createdCriterion = await criterionService.createCriterion({
          rubric_id: id,
          name: criterion.name.trim(),
          description: criterion.description.trim(),
          weight: Number(criterion.weight),
        });

        if (!createdCriterion?.id) {
          throw new Error("No se pudo crear uno de los criterios.");
        }

        criterionId = createdCriterion.id;
      }

      const originalCriterion = originalCriteria.find(
        (item) => item.id === criterion.id
      );

      const currentScaleIds = criterion.scales
        .map((scale) => scale.id)
        .filter(Boolean);

      const scalesToDelete =
        originalCriterion?.scales.filter(
          (scale) => scale.id && !currentScaleIds.includes(scale.id)
        ) ?? [];

      for (const scale of scalesToDelete) {
        if (scale.id) {
          await scaleService.deleteScale(scale.id);
        }
      }

      for (const scale of criterion.scales) {
        if (scale.id) {
          await scaleService.updateScale(scale.id, {
            criterion_id: criterionId,
            name: scale.name.trim(),
            description: scale.description.trim(),
            value: Number(scale.value),
          });
        } else {
          await scaleService.createScale({
            criterion_id: criterionId,
            name: scale.name.trim(),
            description: scale.description.trim(),
            value: Number(scale.value),
          });
        }
      }
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!id) return;

    try {
      if (publish) {
        validateBeforePublish();
      }

      const updatedRubric = await rubricService.updateRubric(id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        is_public: publish,
        is_archived: rubric?.is_archived ?? false,
      });

      if (!updatedRubric) {
        throw new Error("No se pudo actualizar la rúbrica.");
      }

      await syncCriteriaAndScales();

      await Swal.fire(
        publish ? "Rúbrica publicada" : "Borrador actualizado",
        publish
          ? "La rúbrica fue publicada correctamente."
          : "La rúbrica fue actualizada correctamente.",
        "success"
      );

      navigate("/rubrics/list");
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la rúbrica.",
        "error"
      );
    }
  };

  if (!rubric) {
    return <p>Cargando...</p>;
  }

  return (
    <>
      <AcademicHeader
        title="Definir criterios y escalas"
        description="Actualiza la rúbrica y define los niveles de desempeño de cada criterio."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <RubricBasicForm
            title={formData.title}
            description={formData.description}
            onChange={handleBasicChange}
          />

          <RubricCriteriaEditor
            criteria={formData.criteria}
            onChange={handleCriteriaChange}
          />
        </div>

        <RubricSummaryPanel
          title={formData.title}
          criteria={formData.criteria}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => navigate("/rubrics/list")}
          className="rounded border border-stroke px-4 py-2"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={() => handleSave(false)}
          className="rounded border border-stroke px-4 py-2"
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={() => handleSave(true)}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          Publicar rúbrica
        </button>
      </div>
    </>
  );
};

export default UpdateRubric;