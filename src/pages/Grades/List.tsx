/* Archivo: pages/Grades/List.tsx   Proposito: Pagina para listar y gestionar registros de Grades.*/
import React, { useEffect, useState } from 'react';
import { Grade } from '../../models/Grade';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { gradeService } from '../../services/gradeService';
const GradesList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Grade[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const grades = await gradeService.getGrades();
    setData(grades);
  };
  const handleCreate = () => {
    navigate('/grades/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Calificaciones</h2>{' '}
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
export default GradesList;
