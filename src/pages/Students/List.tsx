/* Archivo: pages/Students/List.tsx   Proposito: Pagina para listar y gestionar registros de Students.*/
import React, { useEffect, useState } from 'react';
import { Student } from '../../models/Student';
import GenericTable from '../../components/GenericTable';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { studentService } from '../../services/studentService';
const StudentsList: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Student[]>([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const students = await studentService.getStudents();
    setData(students);
  };
  const handleAction = (action: string, item: Student) => {
    if (action === 'edit') {
      navigate(`/students/update/${item.id}`);
    } else if (action === 'delete') {
      deleteStudent(item.id ? item.id : '0');
    }
  };
  const deleteStudent = async (id: string) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        const success = await studentService.deleteStudent(id);
        if (success) {
          Swal.fire(
            '¡Eliminado!',
            'El estudiante ha sido eliminado.',
            'success',
          );
          fetchData();
        }
      }
    });
  };
  const handleCreate = () => {
    navigate('/students/create');
  };
  return (
    <div>
      {' '}
      <h2>Lista de Estudiantes</h2>{' '}
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
export default StudentsList;
