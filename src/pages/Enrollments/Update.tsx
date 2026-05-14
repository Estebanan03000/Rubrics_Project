/* Archivo: pages/Enrollments/Update.tsx   Proposito: Pagina para editar registros de Enrollments.*/
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Enrollment } from '../../models/Enrollment';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumb';
import { enrollmentService } from '../../services/enrollmentService';
const UpdateEnrollment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [formData, setFormData] = useState<Enrollment>({});
  useEffect(() => {
    const fetchEnrollment = async () => {
      if (!id) return;
      const data = await enrollmentService.getEnrollmentById(id);
      if (data) {
        setEnrollment(data);
        setFormData(data);
      }
    };
    fetchEnrollment();
  }, [id]);
  const handleUpdateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedEnrollment = await enrollmentService.updateEnrollment(
        id!,
        formData,
      );
      if (updatedEnrollment) {
        Swal.fire({
          title: 'Completado',
          text: 'Se ha actualizado correctamente la inscripción',
          icon: 'success',
          timer: 3000,
        });
        navigate('/enrollments/list');
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Existe un problema al momento de actualizar la inscripción',
          icon: 'error',
          timer: 3000,
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Existe un problema al momento de actualizar la inscripción',
        icon: 'error',
        timer: 3000,
      });
    }
  };
  if (!enrollment) {
    return <div>Cargando...</div>;
  }
  return (
    <>
      {' '}
      <Breadcrumb pageName="Actualizar Inscripción" />{' '}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        {' '}
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          {' '}
          <h3 className="font-medium text-black dark:text-white">
            Formulario de Actualización
          </h3>{' '}
        </div>{' '}
        <form onSubmit={handleUpdateEnrollment}>
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
export default UpdateEnrollment;
