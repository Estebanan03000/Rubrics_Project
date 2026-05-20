import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import GenericTable from '../../components/GenericTable';

import { Enrollment } from '../../models/Enrollment';
import { enrollmentService } from '../../services/enrollmentService';
import { auditLogService } from '../../services/auditLogService';

export default function EnrollmentsList() {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const loadEnrollments = async () => {
    const data = await enrollmentService.getEnrollments();
    setEnrollments(data);
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const tableData = enrollments.map((enrollment) => ({
    id: enrollment.id,
    student_id: enrollment.student_id || '',
    group_id: enrollment.group_id || '',
    enrollment_date: enrollment.enrollment_date || '',
    status: enrollment.status || '',
    original: enrollment,
  }));

  const columns = [
    'student_id',
    'group_id',
    'enrollment_date',
    'status',
  ];

  const actions = [
    {
      name: 'delete',
      label: 'Cancelar',
    },
  ];

  const handleCancel = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Cancelar inscripción?',
      text: 'La inscripción quedará cancelada, pero no será eliminada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'Volver',
    });

    if (!result.isConfirmed) return;

    try {
      await enrollmentService.cancelEnrollment(id);
      auditLogService.createLog({
        action: 'CANCEL',
        entity_name: 'Enrollment',
        entity_id: id,
        detail: 'Inscripción cancelada',
      });

      await loadEnrollments();

      Swal.fire(
        'Cancelada',
        'La inscripción fue cancelada correctamente.',
        'success',
      );
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'No se pudo cancelar la inscripción.',
        'error',
      );
    }
  };

  const handleTableAction = (
    action: string,
    item: Record<string, any>,
  ) => {
    const enrollment = item.original as Enrollment;

    if (action === 'delete' && enrollment.id) {
      handleCancel(enrollment.id);
    }
  };

  return (
    <>
      <Breadcrumb pageName="Inscripciones" />

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => navigate('/enrollments/create')}
          className="rounded bg-primary px-5 py-2 text-sm text-white"
        >
          Nueva inscripción
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