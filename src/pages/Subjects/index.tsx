import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import GenericTable from '../../components/GenericTable';

import { Subject } from '../../models/Subject';
import { subjectService } from '../../services/subjectService';
import { auditLogService } from '../../services/auditLogService';

export default function Subjects() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState<Subject[]>([]);

  const loadSubjects = async () => {
    const data = await subjectService.getSubjects();
    setSubjects(data);
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  const tableData = subjects.map((subject) => ({
    id: subject.id,
    name: subject.name || '',
    code: subject.code || '',
    credits: subject.credits || 0,
    status: subject.is_active ? 'Activa' : 'Archivada',
    original: subject,
  }));

  const columns = ['name', 'code', 'credits', 'status'];

  const actions = [
    { name: 'edit', label: 'Editar' },
    { name: 'delete', label: 'Archivar' },
  ];

  const handleArchive = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Archivar asignatura?',
      text: 'La asignatura quedará inactiva, pero no será eliminada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    try {
      await subjectService.archiveSubject(id);
      auditLogService.createLog({
        action: 'ARCHIVE',
        entity_name: 'Subject',
        entity_id: id,
        detail: 'Asignatura archivada',
      });
      await loadSubjects();

      Swal.fire(
        'Archivada',
        'La asignatura fue archivada correctamente.',
        'success',
      );
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'No se pudo archivar la asignatura.',
        'error',
      );
    }
  };

  const handleTableAction = (
    action: string,
    item: Record<string, any>,
  ) => {
    const subject = item.original as Subject;

    if (action === 'edit' && subject.id) {
      navigate(`/subjects/update/${subject.id}`);
    }

    if (action === 'delete' && subject.id) {
      handleArchive(subject.id);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Asignaturas" />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate('/subjects/create')}
          className="rounded bg-primary px-5 py-2 text-sm text-white"
        >
          Crear asignatura
        </button>
      </div>

      <GenericTable
        data={tableData}
        columns={columns}
        actions={actions}
        onAction={handleTableAction}
      />
    </>
  );
}