import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";

import { Registration } from "../../models/Registration";
import { Student } from "../../models/Student";
import { Career } from "../../models/Career";

import { registrationService } from "../../services/registrationService";
import { studentService } from "../../services/studentService";
import { careerService } from "../../services/careerService";
import { registrationBusiness } from "../../business/registrationBusiness";

const academicStatuses = [
  { value: "ACTIVE", label: "Activo" },
  { value: "RETIRED", label: "Retirado" },
  { value: "SUSPENDED", label: "Suspendido" },
  { value: "GRADUATED", label: "Egresado" },
];

const RegistrationsList: React.FC = () => {
  const navigate = useNavigate();

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [registrationsResponse, studentsResponse, careersResponse] =
      await Promise.all([
        registrationService.getRegistrations(),
        studentService.getStudents(),
        careerService.getCareers(),
      ]);

    setRegistrations(registrationsResponse);
    setStudents(studentsResponse);
    setCareers(careersResponse);
  };

  const getStudentName = (studentId: string) => {
    const student: any = students.find((item: any) => item.id === studentId);

    if (!student) return studentId;

    const firstName =
      student.first_name ??
      student.user?.first_name ??
      student.profile?.first_name ??
      "";

    const lastName =
      student.last_name ??
      student.user?.last_name ??
      student.profile?.last_name ??
      "";

    const fullName = `${firstName} ${lastName}`.trim();

    return fullName || student.name || studentId;
  };

  const getCareerName = (careerId: string) => {
    const career = careers.find((item) => item.id === careerId);
    return career ? `${career.name} (${career.code})` : careerId;
  };

  const getStatusLabel = (status: string) => {
    return (
      academicStatuses.find((item) => item.value === status)?.label ?? status
    );
  };

  const handleChangeAcademicStatus = async (registration: Registration) => {
    if (!registration.id) return;

    const { value: newStatus } = await Swal.fire({
      title: "Cambiar estado académico",
      input: "select",
      inputOptions: {
        ACTIVE: "Activo",
        RETIRED: "Retirado",
        SUSPENDED: "Suspendido",
        GRADUATED: "Egresado",
      },
      inputValue: registration.academic_status,
      inputPlaceholder: "Seleccione un estado",
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      inputValidator: (value) => {
        if (!value) {
          return "Debe seleccionar un estado académico.";
        }

        return null;
      },
    });

    if (!newStatus) return;

    try {
      const updated = await registrationBusiness.updateAcademicStatus(
        registration.id,
        newStatus
      );

      if (!updated) {
        throw new Error("No se pudo actualizar la matrícula.");
      }

      await Swal.fire(
        "Actualizado",
        "El estado académico de la matrícula fue actualizado correctamente.",
        "success"
      );

      await loadData();
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo actualizar la matrícula.",
        "error"
      );
    }
  };

  const columns: TableColumn<Registration>[] = [
    {
      header: "Estudiante",
      render: (registration) => getStudentName(registration.student_id),
    },
    {
      header: "Carrera",
      render: (registration) => getCareerName(registration.career_id),
    },
    {
      header: "Periodo de ingreso",
      render: (registration) => registration.admission_period,
    },
    {
      header: "Estado académico",
      render: (registration) => getStatusLabel(registration.academic_status),
    },
    {
      header: "Estado",
      render: (registration) =>
        registration.is_active ? "Matrícula activa" : "Matrícula inactiva",
    },
    {
      header: "Acciones",
      render: (registration) => (
        <button
          type="button"
          onClick={() => handleChangeAcademicStatus(registration)}
          className="rounded border border-stroke px-3 py-1 text-sm"
        >
          Cambiar estado
        </button>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Matrículas"
        description="Gestiona la vinculación formal de estudiantes a carreras."
        buttonText="Matricular estudiante"
        onButtonClick={() => navigate("/registrations/create")}
      />

      <EntityTable
        columns={columns}
        data={registrations}
        emptyMessage="No hay matrículas registradas."
      />
    </>
  );
};

export default RegistrationsList;