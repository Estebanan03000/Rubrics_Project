/* Archivo: pages/Teachers/Update.tsx   Proposito: Pagina para editar registros de Teachers.*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Teacher } from '../../models/Teacher';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { teacherService } from '../../services/teacherService';
const UpdateTeacher = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<Teacher>({});
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!id) return;
      const data = await teacherService.getTeacherById(id);
      if (data) {
        setTeacher(data);
        setFormData(data);
      }
    };
    fetchTeacher();
  }, [id]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedTeacher = await teacherService.updateTeacher(id!, formData);
      if (updatedTeacher) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha actualizado correctamente el docente',
          icon: 'success',
          timer: 3000,
        });
        navigate('/teachers/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de actualizar el docente',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de actualizar el docente',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  if (!teacher) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      {' '}
      <Breadcrumb pageName="Actualizar Docente" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Actualización
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleUpdateTeacher}>
          {' '}
          <div className="p-6.5">
            {' '}
            <div className="mb-4.5">
              {' '}
              <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                Email
              </label>{' '}
              <input
                type="email"
                name="email"
                value={formData.email || ''}
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
export default UpdateTeacher;
