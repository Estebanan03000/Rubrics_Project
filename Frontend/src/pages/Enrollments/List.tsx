/* Archivo: pages/Enrollments/List.tsx   Proposito: Pagina para listar y gestionar registros de Enrollments.*/
import React, { useEffect, useState } from 'react';
import { Enrollment } from '../../models/Enrollment';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { enrollmentService } from '../../services/enrollmentService';
const EnrollmentsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Enrollment[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const enrollments = await enrollmentService.getEnrollments();
    setData(enrollments);
  };
  const handleCreate = () => {
    navigate('/enrollments/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Inscripciones</h2>{' '}
      <button
        onClick={handleCreate}
        className="inline-flex items-center justify-center bg-primary py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-opacity-90 transition"
      >
        {' '}
        Crear{' '}
      </button>{' '}
    </div>
  );
};
export default EnrollmentsList;
