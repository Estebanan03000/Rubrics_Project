/* Archivo: pages/Criteria/Create.tsx   Proposito: Pagina para crear registros de Criteria.*/
import React, { useState } from 'react';
import { Criterion } from '../../models/Criterion';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { criterionService } from '../../services/criterionService';
const CreateCriterion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Criterion>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateCriterion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdCriterion = await criterionService.createCriterion(formData);
      if (createdCriterion) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha creado correctamente el criterio',
          icon: 'success',
          timer: 3000,
        });
        navigate('/criteria/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de crear el criterio',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de crear el criterio',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  return (
    <div>
      {' '}
      <Breadcrumb pageName="Crear Criterio" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Criterio
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleCreateCriterion}>
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
                placeholder="Ingrese el nombre del criterio"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />{' '}
            </div>{' '}
            <div className="mb-4.5">
              {' '}
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                {' '}
                Peso{' '}
              </label>{' '}
              <input
                type="number"
                step="0.01"
                name="weight"
                value={formData.weight || ''}
                onChange={handleChange}
                placeholder="Ingrese el peso del criterio"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />{' '}
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
export default CreateCriterion;
