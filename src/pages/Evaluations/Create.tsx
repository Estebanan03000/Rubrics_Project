/* Archivo: pages/Evaluations/Create.tsx   Proposito: Pagina para crear registros de Evaluations.*/
import React, { useState } from 'react';
import { Evaluation } from '../../models/Evaluation';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { evaluationService } from '../../services/evaluationService';
const CreateEvaluation = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Evaluation>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdEvaluation = await evaluationService.createEvaluation(
        formData,
      );
      if (createdEvaluation) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha creado correctamente la evaluación',
          icon: 'success',
          timer: 3000,
        });
        navigate('/evaluations/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de crear la evaluación',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de crear la evaluación',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  return (
    <div>
      {' '}
      <Breadcrumb pageName="Crear Evaluación" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Evaluación
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleCreateEvaluation}>
          {' '}
          <div className="p-6.5">
            {' '}
            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
            >
              {' '}
              Crear{' '}
            </button>{' '}
          </div>{' '}
        </form>{' '}
      </div>{' '}
    </div>
  );
};
export default CreateEvaluation;
