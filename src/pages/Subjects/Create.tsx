import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import SubjectForm from '../../components/subjects/SubjectForm';

import { Subject } from '../../models/Subject';
import { subjectService } from '../../services/subjectService';
import { auditLogService } from '../../services/auditLogService';

export default function CreateSubject() {
  const navigate = useNavigate();

  const handleCreate = async (data: Subject) => {
    if (!data.name || !data.code || !data.credits) {
      Swal.fire(
        'Campos obligatorios',
        'Nombre, código y créditos son obligatorios.',
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
      await subjectService.createSubject(data);
      auditLogService.createLog({
        action: 'CREATE',
        entity_name: 'Subject',
        entity_id: data.id,
        detail: `Asignatura creada: ${data.name}`,
      });

      Swal.fire(
        'Completado',
        'La asignatura fue creada correctamente.',
        'success',
      );

      navigate('/subjects');
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'No se pudo crear la asignatura.',
        'error',
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Crear asignatura" />

      <div className="mx-auto max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <SubjectForm onSubmit={handleCreate} />
      </div>
    </>
  );
}