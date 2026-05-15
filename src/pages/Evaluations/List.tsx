/* Archivo: pages/Evaluations/List.tsx   Proposito: Pagina para listar y gestionar registros de Evaluations.*/
import React, { useEffect, useState } from 'react';
import { Evaluation } from '../../models/Evaluation';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { evaluationService } from '../../services/evaluationService';
const EvaluationsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Evaluation[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const evaluations = await evaluationService.getEvaluations();
    setData(evaluations);
  };
  const handleCreate = () => {
    navigate('/evaluations/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Evaluaciones</h2>{' '}
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
export default EvaluationsList;
