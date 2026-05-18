import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';

import { Rubric } from '../../models/Rubric';
import { evaluationService } from '../../services/evaluationService';

export default function RubricDetail() {
  const { id } = useParams();

  const [rubric, setRubric] = useState<Rubric | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRubric = async () => {
      if (!id) return;

      try {
        const data = await evaluationService.getEvaluationRubric(id);
        setRubric(data);
      } catch (error: any) {
        Swal.fire(
          'Sin rúbrica asociada',
          error?.response?.data?.message ||
            error?.response?.data?.detail ||
            'Esta evaluación aún no tiene una rúbrica asociada.',
          'info',
        );
      } finally {
        setLoading(false);
      }
    };

    loadRubric();
  }, [id]);

  if (loading) return <div>Cargando rúbrica...</div>;

  if (!rubric) {
    return (
      <>
        <Breadcrumb pageName="Rúbrica de evaluación" />

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <p className="text-sm text-black dark:text-white">
            Esta evaluación aún no tiene una rúbrica asociada.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb pageName="Rúbrica de evaluación" />

      <div className="space-y-6">
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h2 className="text-2xl font-bold text-black dark:text-white">
            {rubric.title || rubric.name || 'Rúbrica'}
          </h2>

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {rubric.description || 'Sin descripción'}
          </p>
        </div>

        {rubric.criteria?.map((criterion) => (
          <div
            key={criterion.id}
            className="rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white">
                  {criterion.name}
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {criterion.description}
                </p>
              </div>

              <span className="rounded bg-primary px-3 py-1 text-xs text-white">
                Peso: {criterion.weight ?? 0}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                      Escala
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                      Descripción
                    </th>
                    <th className="px-4 py-3 text-sm font-medium text-black dark:text-white">
                      Valor
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {criterion.scales?.map((scale) => (
                    <tr key={scale.id}>
                      <td className="border-b border-[#eee] px-4 py-3 text-sm dark:border-strokedark">
                        {scale.name}
                      </td>

                      <td className="border-b border-[#eee] px-4 py-3 text-sm dark:border-strokedark">
                        {scale.description}
                      </td>

                      <td className="border-b border-[#eee] px-4 py-3 text-sm dark:border-strokedark">
                        {scale.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}