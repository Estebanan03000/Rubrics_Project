import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import GenericTable from '../../components/GenericTable';

import { Evaluation } from '../../models/Evaluation';

import { evaluationService } from '../../services/evaluationService';

export default function EvaluationsList() {
  const navigate = useNavigate();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  const loadEvaluations = async () => {
    const data = await evaluationService.getEvaluations();
    setEvaluations(data);
  };

  useEffect(() => {
    loadEvaluations();
  }, []);

  const tableData = evaluations.map((evaluation) => ({
    id: evaluation.id,
    name: evaluation.name || '',
    rubric_id: evaluation.rubric_id || 'Sin rúbrica',
    subject_id: evaluation.subject_id || 'Sin asignatura',
    created_at: evaluation.created_at || '',
    original: evaluation,
  }));

  const columns = [
    'name',
    'rubric_id',
    'subject_id',
    'created_at',
  ];

  const actions = [
    {
      name: 'view',
      label: 'Ver rúbrica',
    },

    {
      name: 'associate',
      label: 'Asociar rúbrica',
    },
  ];

  const handleTableAction = (
    action: string,
    item: Record<string, any>,
  ) => {
    const evaluation = item.original as Evaluation;

    if (action === 'view' && evaluation.id) {
      navigate(`/evaluations/${evaluation.id}/rubric`);
    }

    if (action === 'associate' && evaluation.id) {
      navigate('/evaluations/associate-rubric');
    }
  };

  return (
    <>
      <Breadcrumb pageName="Evaluaciones" />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() =>
            navigate('/evaluations/associate-rubric')
          }
          className="rounded bg-primary px-5 py-2 text-sm text-white"
        >
          Asociar rúbrica
        </button>
      </div>

      {evaluations.length === 0 ? (
        <div className="rounded-sm border border-stroke bg-white p-6 text-center shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-black dark:text-white">
            No hay evaluaciones registradas.
          </p>
        </div>
      ) : (
        <GenericTable
          data={tableData}
          columns={columns}
          actions={actions}
          onAction={handleTableAction}
        />
      )}
    </>
  );
}