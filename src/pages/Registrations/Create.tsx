import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";

import { Student } from "../../models/Student";
import { Career } from "../../models/Career";
import { Registration } from "../../models/Registration";

import { studentService } from "../../services/studentService";
import { careerService } from "../../services/careerService";
import { registrationService } from "../../services/registrationService";
import { registrationBusiness } from "../../business/registrationBusiness";

const academicStatuses = [
  { value: "ACTIVE", label: "Activo" },
  { value: "RETIRED", label: "Retirado" },
  { value: "SUSPENDED", label: "Suspendido" },
  { value: "GRADUATED", label: "Egresado" },
];

const CreateRegistration: React.FC = () => {
  const navigate = useNavigate();

  const [students, setStudents] = useState<Student[]>([]);
  const [careers, setCareers] = useState<Career[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const [formData, setFormData] = useState<Omit<Registration, "id">>({
    student_id: "",
    career_id: "",
    admission_period: "",
    academic_status: "ACTIVE",
    is_active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [studentsResponse, careersResponse, registrationsResponse] =
      await Promise.all([
        studentService.getStudents(),
        careerService.getCareers(),
        registrationService.getRegistrations(),
      ]);

    setStudents(studentsResponse);
    setCareers(careersResponse.filter((career) => career.is_active));
    setRegistrations(registrationsResponse);
  };

  const getStudentFullName = (student: any) => {
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

    return fullName || student.name || "Estudiante sin nombre";
  };

  const getStudentIdentification = (student: any) => {
    return (
      student.identification ??
      student.user?.identification ??
      student.profile?.identification ??
      student.document ??
      student.code ??
      ""
    );
  };

  const isStudentActive = (student: any) => {
    return student.is_active ?? student.user?.is_active ?? true;
  };

  const filteredStudents = useMemo(() => {
    const search = studentSearch.toLowerCase();

    return students
      .filter((student) => isStudentActive(student))
      .filter((student) => {
        const text = `
          ${getStudentFullName(student)}
          ${getStudentIdentification(student)}
        `.toLowerCase();

        return text.includes(search);
      });
  }, [students, studentSearch]);

  const selectedStudent: any = students.find(
    (student: any) => student.id === selectedStudentId
  );

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId);

    setFormData((prev) => ({
      ...prev,
      student_id: studentId,
    }));
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateRegistration = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const created = await registrationBusiness.createRegistration(
        formData,
        registrations
      );

      if (!created) {
        throw new Error("No se pudo crear la matrícula.");
      }

      await Swal.fire(
        "Matrícula creada",
        "El estudiante fue matriculado correctamente en la carrera.",
        "success"
      );

      navigate("/registrations/list");
    } catch (error) {
      await Swal.fire(
        "No se puede matricular",
        error instanceof Error
          ? error.message
          : "No se pudo crear la matrícula.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader
        title="Matricular estudiante en carrera"
        description="Registra la vinculación formal de un estudiante a una carrera."
      />

      <form
        onSubmit={handleCreateRegistration}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Buscar estudiante
          </h3>

          <input
            type="text"
            value={studentSearch}
            onChange={(event) => setStudentSearch(event.target.value)}
            placeholder="Buscar por nombre, apellido o cédula..."
            className="mb-4 w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
          />

          <div className="max-h-80 overflow-y-auto rounded border border-stroke dark:border-strokedark">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-3">Seleccionar</th>
                  <th className="px-4 py-3">Estudiante</th>
                  <th className="px-4 py-3">Identificación</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student: any) => (
                  <tr key={student.id} className="border-t border-stroke">
                    <td className="px-4 py-3">
                      <input
                        type="radio"
                        name="selected_student"
                        checked={selectedStudentId === student.id}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </td>

                    <td className="px-4 py-3">{getStudentFullName(student)}</td>
                    <td className="px-4 py-3">
                      {getStudentIdentification(student) || "-"}
                    </td>
                    
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-6 text-center text-gray-500"
                    >
                      No se encontraron estudiantes activos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Carrera
              </label>

              <select
                name="career_id"
                value={formData.career_id}
                onChange={handleChange}
                className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
              >
                <option value="">Seleccione una carrera</option>
                {careers.map((career) => (
                  <option key={career.id} value={career.id}>
                    {career.name} ({career.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Periodo de ingreso
              </label>

              <input
                type="text"
                name="admission_period"
                value={formData.admission_period}
                onChange={handleChange}
                placeholder="Ej: 2026-01"
                className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium text-black dark:text-white">
                Estado académico inicial
              </label>

              <select
                name="academic_status"
                value={formData.academic_status}
                onChange={handleChange}
                className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
              >
                {academicStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="rounded bg-primary px-4 py-2 text-white"
            >
              Matricular estudiante
            </button>

            <button
              type="button"
              onClick={() => navigate("/registrations/list")}
              className="rounded border border-stroke px-4 py-2"
            >
              Cancelar
            </button>
          </div>
        </div>

        <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Información de la matrícula
          </h3>

          <div className="space-y-3 text-sm">
            <p>
              <strong>Estudiante:</strong>{" "}
              {selectedStudent ? getStudentFullName(selectedStudent) : "-"}
            </p>

            <p>
              <strong>Identificación:</strong>{" "}
              {selectedStudent ? getStudentIdentification(selectedStudent) : "-"}
            </p>

            <p>
              <strong>Carrera:</strong>{" "}
              {careers.find((career) => career.id === formData.career_id)
                ?.name ?? "-"}
            </p>

            <p>
              <strong>Periodo de ingreso:</strong>{" "}
              {formData.admission_period || "-"}
            </p>

            <p>
              <strong>Estado académico:</strong>{" "}
              {academicStatuses.find(
                (status) => status.value === formData.academic_status
              )?.label ?? "-"}
            </p>
          </div>

          <div className="mt-6 rounded border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
            <p className="font-medium">Reglas</p>
            <p className="mt-2">
              El estudiante debe estar activo y no debe tener una matrícula
              activa en la misma carrera.
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateRegistration;