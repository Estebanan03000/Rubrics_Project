import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import AssociateRubricForm from '../../components/evaluations/AssociateRubricForm';

import { Evaluation } from '../../models/Evaluation';
import { Rubric } from '../../models/Rubric';

import { evaluationService } from '../../services/evaluationService';
import { rubricService } from '../../services/rubricService';
import { auditLogService } from '../../services/auditLogService';

export default function AssociateRubric() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [evaluationsData, rubricsData] =
        await Promise.all([
          evaluationService.getEvaluations(),
          rubricService.getPublicRubrics(),
        ]);

      setEvaluations(evaluationsData);
      setRubrics(rubricsData);
    };

    loadData();
  }, []);

  const handleSubmit = async (
    evaluationId: string,
    rubricId: string,
  ) => {
    if (!evaluationId || !rubricId) {
      Swal.fire(
        'Campos obligatorios',
        'Debes seleccionar evaluación y rúbrica.',
        'warning',
      );
      return;
    }

    try {
      await evaluationService.associateRubric(
        evaluationId,
        rubricId,
      );
      auditLogService.createLog({
        action: 'ASSOCIATE_RUBRIC',
        entity_name: 'Evaluation',
        entity_id: evaluationId,
        detail: `Rúbrica ${rubricId} asociada a evaluación ${evaluationId}`,
      });

      Swal.fire(
        'Completado',
        'La rúbrica fue asociada correctamente.',
        'success',
      );
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          error?.message ||
          'No se pudo asociar la rúbrica.',
        'error',
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Asociar rúbrica a evaluación" />

      <div className="mx-auto max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <AssociateRubricForm
          evaluations={evaluations}
          rubrics={rubrics}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}