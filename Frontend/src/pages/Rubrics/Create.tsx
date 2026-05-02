/* Archivo: pages/Rubrics/Create.tsx   Proposito: Pagina para crear registros de Rubrics.*/
import React, { useState } from 'react';
import { Rubric } from '../../models/Rubric';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { rubricService } from '../../services/rubricService';
const CreateRubric = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Rubric>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateRubric = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdRubric = await rubricService.createRubric(formData);
      if (createdRubric) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha creado correctamente la rúbrica',
          icon: 'success',
          timer: 3000,
        });
        navigate('/rubrics/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de crear la rúbrica',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de crear la rúbrica',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  return (
    <div>
      {' '}
      <Breadcrumb pageName="Crear Rúbrica" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Rúbrica
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleCreateRubric}>
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
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                placeholder="Ingrese el nombre de la rúbrica"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />{' '}
            </div>{' '}
            <div className="mb-4.5">
              {' '}
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                {' '}
                Descripción{' '}
              </label>{' '}
              <textarea
                name="description"
                rows={4}
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Ingrese la descripción de la rúbrica"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              ></textarea>{' '}
            </div>{' '}
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
export default CreateRubric;
