/* Archivo: pages/Subjects/List.tsx   Proposito: Pagina para listar y gestionar registros de Subjects.*/
import React, { useEffect, useState } from 'react';
import { Subject } from '../../models/Subject';
import GenericTable from '../../components/GenericTable';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { subjectService } from '../../services/subjectService';
const SubjectsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Subject[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const subjects = await subjectService.getSubjects();
    setData(subjects);
  };
  const handleAction = (action: string, item: Subject) => {
    if (action === 'edit') {
      navigate(`/subjects/update/${item.id}`);
    } else if (action === 'delete') {
      deleteSubject(item.id ? item.id : '0');
    }
  };
  const deleteSubject = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await subjectService.deleteSubject(id);
        if (success) {
          Swal.fire(
            '¡Eliminado!',
            'La asignatura ha sido eliminada.',
            'success',
          );
          fetchData();
        }
      }
    });
  };
  const handleCreate = () => {
    navigate('/subjects/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Asignaturas</h2>{' '}
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
export default SubjectsList;
