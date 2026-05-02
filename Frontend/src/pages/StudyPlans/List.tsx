/* Archivo: pages/StudyPlans/List.tsx   Proposito: Pagina para listar y gestionar registros de StudyPlans.*/
import React, { useEffect, useState } from 'react';
import { StudyPlan } from '../../models/StudyPlan';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { studyPlanService } from '../../services/studyPlanService';
const StudyPlansList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<StudyPlan[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const studyPlans = await studyPlanService.getStudyPlans();
    setData(studyPlans);
  };
  const handleCreate = () => {
    navigate('/studyplans/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Planes de Estudio</h2>{' '}
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
export default StudyPlansList;
