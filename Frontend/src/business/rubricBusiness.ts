import { Rubric } from "../models/Rubric";
import { RubricCriterionInput } from "../models/RubricCriterionInput";
import { RubricFormData } from "../models/RubricFormData";
import { rubricService } from "../services/rubricService";
import { criterionService } from "../services/criterionService";
import { scaleService } from "../services/scaleService";

class RubricBusiness {
  private getTotalWeight(criteria: RubricCriterionInput[]): number {
    return criteria.reduce((total, criterion) => {
      return total + Number(criterion.weight || 0);
    }, 0);
  }

  private validateBasicData(data: RubricFormData): void {
    if (!data.title.trim()) {
      throw new Error("El título de la rúbrica es obligatorio.");
    }

    if (!data.description.trim()) {
      throw new Error("La descripción de la rúbrica es obligatoria.");
    }
  }

  private validateCriteriaForPublication(criteria: RubricCriterionInput[]): void {
    if (criteria.length === 0) {
      throw new Error("No se puede publicar una rúbrica sin criterios.");
    }

    const hasInvalidCriterion = criteria.some(
      (criterion) =>
        !criterion.name.trim() ||
        !criterion.description.trim() ||
        Number(criterion.weight) <= 0 ||
        criterion.scales.length < 2 ||
        criterion.scales.length > 5 ||
        criterion.scales.some(
          (scale) =>
            !scale.name.trim() ||
            !scale.description.trim() ||
            Number(scale.value) <= 0
        )
    );

    if (hasInvalidCriterion) {
      throw new Error(
        "Todos los criterios deben tener nombre, descripción, peso mayor a cero y entre 2 y 5 escalas válidas."
      );
    }

    const totalWeight = this.getTotalWeight(criteria);

    if (totalWeight !== 100) {
      throw new Error(
        `La suma de los pesos debe ser exactamente 100%. Actualmente es ${totalWeight}%.`
      );
    }
  }

  async createRubric(
    data: RubricFormData,
    publish: boolean
  ): Promise<Rubric | null> {
    this.validateBasicData(data);

    if (publish) {
      this.validateCriteriaForPublication(data.criteria);
    }

    const createdRubric = await rubricService.createRubric({
      title: data.title.trim(),
      description: data.description.trim(),
      is_public: publish,
      is_archived: false,
    });

    if (!createdRubric?.id) {
      throw new Error("No se pudo crear la rúbrica.");
    }

    for (const criterion of data.criteria) {
      if (
        criterion.name.trim() &&
        criterion.description.trim() &&
        Number(criterion.weight) > 0
      ) {
        const createdCriterion = await criterionService.createCriterion({
          rubric_id: createdRubric.id,
          name: criterion.name.trim(),
          description: criterion.description.trim(),
          weight: Number(criterion.weight),
        });

        if (!createdCriterion) {
          throw new Error(
            "La rúbrica fue creada, pero ocurrió un error creando sus criterios."
          );
        }

        for (const scale of criterion.scales) {
          const createdScale = await scaleService.createScale({
            criterion_id: createdCriterion.id,
            name: scale.name.trim(),
            description: scale.description.trim(),
            value: Number(scale.value),
          });

          if (!createdScale) {
            throw new Error(
              "La rúbrica fue creada, pero ocurrió un error creando las escalas."
            );
          }
        }
      }
    }

    return createdRubric;
  }

  async archiveRubric(rubricId: string): Promise<Rubric | null> {
    if (!rubricId) {
      throw new Error("Debe seleccionar una rúbrica.");
    }

    return await rubricService.updateRubric(rubricId, {
      is_archived: true,
    });
  }

  async deleteDraftRubric(rubric: Rubric): Promise<boolean> {
    if (rubric.is_public) {
      throw new Error("Una rúbrica publicada no puede eliminarse, solo archivarse.");
    }

    if (!rubric.id) {
      throw new Error("Debe seleccionar una rúbrica.");
    }

    return await rubricService.deleteRubric(rubric.id);
  }
}

export const rubricBusiness = new RubricBusiness();