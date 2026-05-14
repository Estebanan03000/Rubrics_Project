/* Archivo: pages/Groups/Create.tsx   Proposito: Pagina para crear registros de Groups.*/
import React, { useState } from 'react';
import { Group } from '../../models/Group';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groupService';
const CreateGroup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Group>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdGroup = await groupService.createGroup(formData);
      if (createdGroup) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha creado correctamente el grupo',
          icon: 'success',
          timer: 3000,
        });
        navigate('/groups/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de crear el grupo',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de crear el grupo',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  return (
    <div>
      {' '}
      <Breadcrumb pageName="Crear Grupo" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Grupo
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleCreateGroup}>
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
                placeholder="Ingrese el nombre del grupo"
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
export default CreateGroup;
