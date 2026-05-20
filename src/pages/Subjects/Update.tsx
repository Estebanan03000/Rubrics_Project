import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import SubjectForm from '../../components/subjects/SubjectForm';

import { Subject } from '../../models/Subject';
import { subjectService } from '../../services/subjectService';
import { auditLogService } from '../../services/auditLogService';

export default function UpdateSubject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const loadSubject = async () => {
      if (!id) return;

      const data = await subjectService.getSubjectById(id);
      setSubject(data);
    };

    loadSubject();
  }, [id]);

  const handleUpdate = async (data: Subject) => {
    if (!id) return;

    if (!data.name || !data.credits) {
      Swal.fire(
        'Campos obligatorios',
        'Nombre y créditos son obligatorios.',
        'warning',
      );
      return;
    }

    if (Number(data.credits) <= 0) {
      Swal.fire(
        'Créditos inválidos',
        'Los créditos deben ser mayores a cero.',
        'warning',
      );
      return;
    }

    try {
      await subjectService.updateSubject(id, data);
      auditLogService.createLog({
        action: 'UPDATE',
        entity_name: 'Subject',
        entity_id: id,
        detail: `Asignatura actualizada: ${data.name}`,
      });

      Swal.fire(
        'Completado',
        'La asignatura fue actualizada correctamente.',
        'success',
      );

      navigate('/subjects');
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'No se pudo actualizar la asignatura.',
        'error',
      );
    }
  };

  if (!subject) return <div>Cargando...</div>;

  return (
    <>
      <Breadcrumb pageName="Editar asignatura" />

      <div className="mx-auto max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <SubjectForm initialData={subject} onSubmit={handleUpdate} />
      </div>
    </>
  );
}