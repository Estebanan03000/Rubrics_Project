import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import AssociateRubricForm from '../../components/evaluations/AssociateRubricForm';

import { Evaluation } from '../../models/Evaluation';
import { Rubric } from '../../models/Rubric';
import { Subject } from '../../models/Subject';

import { evaluationService } from '../../services/evaluationService';
import { rubricService } from '../../services/rubricService';
import { subjectService } from '../../services/subjectService';

export default function AssociateRubric() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [evaluationsData, rubricsData, subjectsData] =
        await Promise.all([
          evaluationService.getEvaluations(),
          rubricService.getPublicRubrics(),
          subjectService.getSubjects(),
        ]);

      setEvaluations(evaluationsData);
      setRubrics(rubricsData);
      setSubjects(subjectsData);
    };

    loadData();
  }, []);

  const handleSubmit = async (
    evaluationId: string,
    rubricId: string,
    subjectId: string,
  ) => {
    if (!evaluationId || !rubricId || !subjectId) {
      Swal.fire(
        'Campos obligatorios',
        'Debes seleccionar evaluación, rúbrica y asignatura.',
        'warning',
      );
      return;
    }

    try {
      await evaluationService.associateRubric(
        evaluationId,
        rubricId,
        subjectId,
      );

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
          subjects={subjects}
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}