/* Archivo: pages/Scales/List.tsx   Proposito: Pagina para listar y gestionar registros de Scales.*/
import React, { useEffect, useState } from 'react';
import { Scale } from '../../models/Scale';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { scaleService } from '../../services/scaleService';
const ScalesList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Scale[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const scales = await scaleService.getScales();
    setData(scales);
  };
  const handleCreate = () => {
    navigate('/scales/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Escalas</h2>{' '}
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
export default ScalesList;
