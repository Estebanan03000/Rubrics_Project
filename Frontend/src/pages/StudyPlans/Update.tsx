/* Archivo: pages/StudyPlans/Update.tsx   Proposito: Pagina para editar registros de StudyPlans.*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyPlan } from '../../models/StudyPlan';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { studyPlanService } from '../../services/studyPlanService';
const UpdateStudyPlan = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [formData, setFormData] = useState<StudyPlan>({});
  useEffect(() => {
    const fetchStudyPlan = async () => {
      if (!id) return;
      const data = await studyPlanService.getStudyPlanById(id);
      if (data) {
        setStudyPlan(data);
        setFormData(data);
      }
    };
    fetchStudyPlan();
  }, [id]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateStudyPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedStudyPlan = await studyPlanService.updateStudyPlan(
        id!,
        formData,
      );
      if (updatedStudyPlan) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha actualizado correctamente el plan de estudio',
          icon: 'success',
          timer: 3000,
        });
        navigate('/studyplans/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de actualizar el plan de estudio',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de actualizar el plan de estudio',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  if (!studyPlan) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      {' '}
      <Breadcrumb pageName="Actualizar Plan de Estudio" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Actualización
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleUpdateStudyPlan}>
          {' '}
          <div className="p-6.5">
            {' '}
            <div className="mb-4.5">
              {' '}
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                {' '}
                Nombre{' '}
              </label>{' '}
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />{' '}
            </div>{' '}
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
export default UpdateStudyPlan;
