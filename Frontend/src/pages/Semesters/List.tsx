/* Archivo: pages/Semesters/List.tsx   Proposito: Pagina para listar y gestionar registros de Semesters.*/
import React, { useEffect, useState } from 'react';
import { Semester } from '../../models/Semester';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { semesterService } from '../../services/semesterService';
const SemestersList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Semester[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const semesters = await semesterService.getSemesters();
    setData(semesters);
  };
  const handleCreate = () => {
    navigate('/semesters/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Semestres</h2>{' '}
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
export default SemestersList;
