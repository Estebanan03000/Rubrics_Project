/* Archivo: pages/Careers/List.tsx   Proposito: Pagina para listar y gestionar registros de Careers.*/
import React, { useEffect, useState } from 'react';
import { Career } from '../../models/Career';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { careerService } from '../../services/careerService';
const CareersList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Career[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const careers = await careerService.getCareers();
    setData(careers);
  };
  const handleCreate = () => {
    navigate('/careers/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Carreras</h2>{' '}
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
export default CareersList;
