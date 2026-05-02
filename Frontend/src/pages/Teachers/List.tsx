/* Archivo: pages/Teachers/List.tsx   Proposito: Pagina para listar y gestionar registros de Teachers.*/
import React, { useEffect, useState } from 'react';
import { Teacher } from '../../models/Teacher';
import GenericTable from '../../components/GenericTable';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { teacherService } from '../../services/teacherService';
const TeachersList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Teacher[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const teachers = await teacherService.getTeachers();
    setData(teachers);
  };
  const handleAction = (action: string, item: Teacher) => {
    if (action === 'edit') {
      navigate(`/teachers/update/${item.id}`);
    } else if (action === 'delete') {
      deleteTeacher(item.id ? item.id : '0');
    }
  };
  const deleteTeacher = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await teacherService.deleteTeacher(id);
        if (success) {
          Swal.fire('¡Eliminado!', 'El docente ha sido eliminado.', 'success');
          fetchData();
        }
      }
    });
  };
  const handleCreate = () => {
    navigate('/teachers/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Docentes</h2>{' '}
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
export default TeachersList;
