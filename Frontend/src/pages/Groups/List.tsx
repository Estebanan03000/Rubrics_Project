/* Archivo: pages/Groups/List.tsx   Proposito: Pagina para listar y gestionar registros de Groups.*/
import React, { useEffect, useState } from 'react';
import { Group } from '../../models/Group';
import GenericTable from '../../components/GenericTable';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { groupService } from '../../services/groupService';
const GroupsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Group[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const groups = await groupService.getGroups();
    setData(groups);
  };
  const handleAction = (action: string, item: Group) => {
    if (action === 'edit') {
      navigate(`/groups/update/${item.id}`);
    } else if (action === 'delete') {
      deleteGroup(item.id ? item.id : '0');
    }
  };
  const deleteGroup = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await groupService.deleteGroup(id);
        if (success) {
          Swal.fire('¡Eliminado!', 'El grupo ha sido eliminado.', 'success');
          fetchData();
        }
      }
    });
  };
  const handleCreate = () => {
    navigate('/groups/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Grupos</h2>{' '}
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
export default GroupsList;
