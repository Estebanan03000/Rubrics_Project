import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import Breadcrumb from '../../components/Breadcrumb';
import EnrollmentForm from '../../components/enrollments/EnrollmentForm';

import { Student } from '../../models/Student';
import { Group } from '../../models/Group';
import { EnrollmentRequest } from '../../models/Enrollment';

import { studentService } from '../../services/studentService';
import { groupService } from '../../services/groupService';
import { enrollmentService } from '../../services/enrollmentService';
import { auditLogService } from '../../services/auditLogService';

export default function CreateEnrollment() {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [studentsData, groupsData] = await Promise.all([
        studentService.getStudents(),
        groupService.getGroups(),
      ]);

      setStudents(studentsData);
      setGroups(groupsData);
    };

    loadData();
  }, []);

  const handleCreate = async (data: EnrollmentRequest) => {
    if (!data.student_id) {
      Swal.fire(
        'Campo obligatorio',
        'Debes seleccionar un estudiante.',
        'warning',
      );
      return;
    }

    if (!data.group_ids.length) {
      Swal.fire(
        'Campo obligatorio',
        'Debes seleccionar al menos un grupo.',
        'warning',
      );
      return;
    }

    try {
      await enrollmentService.createEnrollments(data);
      auditLogService.createLog({
        action: 'CREATE',
        entity_name: 'Enrollment',
        entity_id: data.student_id,
        detail: `Inscripción creada para ${data.group_ids.length} grupo(s)`,
      });

      Swal.fire(
        'Completado',
        'El estudiante fue inscrito correctamente.',
        'success',
      );

      navigate('/enrollments/list');
    } catch (error: any) {
      Swal.fire(
        'Error',
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          'No se pudo inscribir al estudiante.',
        'error',
      );
    }
  };

  return (
    <>
      <Breadcrumb pageName="Inscribir estudiante en grupo" />

      <div className="mx-auto max-w-3xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <EnrollmentForm
          students={students}
          groups={groups}
          onSubmit={handleCreate}
        />
      </div>
    </>
  );
}