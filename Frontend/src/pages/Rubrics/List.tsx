/* Archivo: pages/Rubrics/List.tsx   Proposito: Pagina para listar y gestionar registros de Rubrics.*/
import React, { useEffect, useState } from 'react';
import { Rubric } from '../../models/Rubric';
import GenericTable from '../../components/GenericTable';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { rubricService } from '../../services/rubricService';
const RubricsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Rubric[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const rubrics = await rubricService.getRubrics();
    setData(rubrics);
  };
  const handleAction = (action: string, item: Rubric) => {
    if (action === 'edit') {
      navigate(`/rubrics/update/${item.id}`);
    } else if (action === 'delete') {
      deleteRubric(item.id ? item.id : '0');
    }
  };
  const deleteRubric = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro que quiere eliminar?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await rubricService.deleteRubric(id);
        if (success) {
          Swal.fire('¡Eliminado!', 'La rúbrica ha sido eliminada.', 'success');
          fetchData();
        }
      }
    });
  };
  const handleCreate = () => {
    navigate('/rubrics/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Rúbricas</h2>{' '}
      <button
        onClick={handleCreate}
        className="inline-flex items-center justify-center bg-primary py-2 px-4 text-sm font-medium text-white rounded-md hover:bg-opacity-90 transition"
      >
        {' '}
        Crear{' '}
      </button>{' '}
      <GenericTable
        data={data}
        columns={['id', 'title', 'description']}
        onAction={handleAction}
      />{' '}
    </div>
  );
};
export default RubricsList;
