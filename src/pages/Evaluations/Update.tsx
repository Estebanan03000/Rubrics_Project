/* Archivo: pages/Evaluations/Update.tsx   Proposito: Pagina para editar registros de Evaluations.*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Evaluation } from '../../models/Evaluation';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { evaluationService } from '../../services/evaluationService';
const UpdateEvaluation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [formData, setFormData] = useState<Evaluation>({});
  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!id) return;
      const data = await evaluationService.getEvaluationById(id);
      if (data) {
        setEvaluation(data);
        setFormData(data);
      }
    };
    fetchEvaluation();
  }, [id]);
  const handleUpdateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedEvaluation = await evaluationService.updateEvaluation(
        id!,
        formData,
      );
      if (updatedEvaluation) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha actualizado correctamente la evaluación',
          icon: 'success',
          timer: 3000,
        });
        navigate('/evaluations/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de actualizar la evaluación',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de actualizar la evaluación',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  if (!evaluation) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      {' '}
      <Breadcrumb pageName="Actualizar Evaluación" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Actualización
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleUpdateEvaluation}>
          {' '}
          <div className="p-6.5">
            {' '}
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
            >
              {' '}
              Actualizar{' '}
            </button>{' '}
          </div>{' '}
        </form>{' '}
      </div>{' '}
    </>
  );
};
export default UpdateEvaluation;
