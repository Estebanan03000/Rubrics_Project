/* Archivo: pages/Criteria/List.tsx   Proposito: Pagina para listar y gestionar registros de Criteria.*/
import React, { useEffect, useState } from 'react';
import { Criterion } from '../../models/Criterion';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { criterionService } from '../../services/criterionService';
const CriteriaList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Criterion[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const criteria = await criterionService.getCriteria();
    setData(criteria);
  };
  const handleCreate = () => {
    navigate('/criteria/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Criterios</h2>{' '}
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
export default CriteriaList;
