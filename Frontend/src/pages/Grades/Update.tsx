/* Archivo: pages/Grades/Update.tsx   Proposito: Pagina para editar registros de Grades.*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Grade } from '../../models/Grade';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { gradeService } from '../../services/gradeService';
const UpdateGrade = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [grade, setGrade] = useState<Grade | null>(null);
  const [formData, setFormData] = useState<Grade>({});
  useEffect(() => {
    const fetchGrade = async () => {
      if (!id) return;
      const data = await gradeService.getGradeById(id);
      if (data) {
        setGrade(data);
        setFormData(data);
      }
    };
    fetchGrade();
  }, [id]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedGrade = await gradeService.updateGrade(id!, formData);
      if (updatedGrade) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha actualizado correctamente la calificación',
          icon: 'success',
          timer: 3000,
        });
        navigate('/grades/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de actualizar la calificación',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de actualizar la calificación',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  if (!grade) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      {' '}
      <Breadcrumb pageName="Actualizar Calificación" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Actualización
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleUpdateGrade}>
          {' '}
          <div className="p-6.5">
            {' '}
            <div className="mb-4.5">
              {' '}
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                {' '}
                Calificación{' '}
              </label>{' '}
              <input
                type="number"
                step="0.01"
                name="value"
                value={formData.value || ''}
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
export default UpdateGrade;
