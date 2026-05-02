/* Archivo: pages/Enrollments/Create.tsx   Proposito: Pagina para crear registros de Enrollments.*/
import React, { useState } from 'react';
import { Enrollment } from '../../models/Enrollment';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollmentService';
const CreateEnrollment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Enrollment>({});
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const createdEnrollment = await enrollmentService.createEnrollment(
        formData,
      );
      if (createdEnrollment) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha creado correctamente la inscripción',
          icon: 'success',
          timer: 3000,
        });
        navigate('/enrollments/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de crear la inscripción',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de crear la inscripción',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  return (
    <div>
      {' '}
      <Breadcrumb pageName="Crear Inscripción" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Inscripción
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleCreateEnrollment}>
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
export default CreateEnrollment;
