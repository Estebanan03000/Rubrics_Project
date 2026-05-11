import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";
import StepIndicator from "../../components/workflow/StepIndicator";

import { Group } from "../../models/Group";
import { Semester } from "../../models/Semester";
import { Subject } from "../../models/Subject";
import { Teacher } from "../../models/Teacher";

import { groupService } from "../../services/groupService";
import { subjectService } from "../../services/subjectService";
import { teacherService } from "../../services/teacherService";
import { groupAssignmentBusiness } from "../../business/groupAssignmentBusiness";

const AssignTeacherToGroup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const groupIdFromUrl = searchParams.get("groupId");

  const [currentStep, setCurrentStep] = useState(1);

  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [groupSearch, setGroupSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (groupIdFromUrl && groups.length > 0) {
      const group = groups.find((item) => item.id === groupIdFromUrl);

      if (group) {
        setSelectedGroup(group);
        setSelectedSemesterId(group.semester_id ?? "");
        setCurrentStep(3);
      }
    }
  }, [groupIdFromUrl, groups]);

  const loadInitialData = async () => {
    try {
      const [
        activeSemesters,
        allGroups,
        allSubjects,
        allTeachers,
      ] = await Promise.all([
        groupAssignmentBusiness.getActiveSemesters(),
        groupService.getGroups(),
        subjectService.getSubjects(),
        teacherService.getTeachers(),
      ]);

      setSemesters(activeSemesters);
      setGroups(allGroups);
      setSubjects(allSubjects);
      setTeachers(allTeachers.filter((teacher) => teacher.is_active !== false));

      if (activeSemesters.length > 0) {
        setSelectedSemesterId(activeSemesters[0].id ?? "");
      }
    } catch {
      await Swal.fire(
        "Error",
        "No se pudo cargar la información para asignar docente.",
        "error"
      );
    }
  };

  const getSubjectName = (subjectId?: string) => {
    const subject = subjects.find((item) => item.id === subjectId);
    return subject ? `${subject.name} (${subject.code})` : "Sin asignatura";
  };

  const getTeacherName = (teacherId?: string) => {
    const teacher = teachers.find((item) => item.id === teacherId);
    return teacher
      ? `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim()
      : "Sin asignar";
  };

  const selectedSemester = useMemo(
    () => semesters.find((semester) => semester.id === selectedSemesterId),
    [semesters, selectedSemesterId]
  );

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const belongsToSemester = group.semester_id === selectedSemesterId;
      const hasSubject = Boolean(group.subject_id);

      const text = `${group.name ?? ""} ${group.group_code ?? ""}`.toLowerCase();

      return (
        belongsToSemester &&
        hasSubject &&
        text.includes(groupSearch.toLowerCase())
      );
    });
  }, [groups, selectedSemesterId, groupSearch]);

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const text = `${teacher.first_name ?? ""} ${teacher.last_name ?? ""} ${
        teacher.identification ?? ""
      }`.toLowerCase();

      return text.includes(teacherSearch.toLowerCase());
    });
  }, [teachers, teacherSearch]);

  const groupColumns: TableColumn<Group>[] = [
    {
      header: "Código",
      render: (group) => group.group_code ?? "Sin código",
    },
    {
      header: "Grupo",
      render: (group) => group.name ?? "Sin nombre",
    },
    {
      header: "Asignatura",
      render: (group) => getSubjectName(group.subject_id),
    },
    {
      header: "Cupos",
      render: (group) => group.capacity ?? "-",
    },
    {
      header: "Docente actual",
      render: (group) => getTeacherName(group.teacher_id),
    },
    {
      header: "Acción",
      render: (group) => (
        <button
          type="button"
          className="rounded bg-primary px-3 py-1 text-sm text-white"
          onClick={() => {
            setSelectedGroup(group);
            setCurrentStep(3);
          }}
        >
          Seleccionar
        </button>
      ),
    },
  ];

  const teacherColumns: TableColumn<Teacher>[] = [
    {
      header: "Nombre",
      render: (teacher) =>
        `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim(),
    },
    {
      header: "Cédula",
      render: (teacher) => teacher.identification ?? "-",
    },
    {
      header: "Especialidad",
      render: (teacher) => teacher.specialty ?? "-",
    },
    {
      header: "Acción",
      render: (teacher) => (
        <button
          type="button"
          className="rounded bg-primary px-3 py-1 text-sm text-white"
          onClick={() => {
            setSelectedTeacher(teacher);
            setCurrentStep(4);
          }}
        >
          Seleccionar
        </button>
      ),
    },
  ];

  const handleConfirmAssignment = async () => {
    if (!selectedGroup?.id || !selectedTeacher?.id) return;

    try {
      const updatedGroup = await groupAssignmentBusiness.assignTeacherToGroup(
        selectedGroup.id,
        selectedTeacher.id
      );

      if (updatedGroup) {
        await Swal.fire(
          "Asignación realizada",
          "El docente fue asignado correctamente al grupo.",
          "success"
        );

        navigate("/groups/list");
      }
    } catch (error) {
      await Swal.fire(
        "Error",
        error instanceof Error
          ? error.message
          : "No se pudo asignar el docente al grupo.",
        "error"
      );
    }
  };

  return (
    <>
      <AcademicHeader
        title="Asignar docente a grupo"
        description="Vincula un docente a un grupo del semestre activo. El grupo debe tener asignatura definida."
      />

      <StepIndicator
        currentStep={currentStep}
        steps={[
          { number: 1, label: "Seleccionar semestre" },
          { number: 2, label: "Seleccionar grupo" },
          { number: 3, label: "Seleccionar docente" },
          { number: 4, label: "Confirmar asignación" },
        ]}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          {currentStep === 1 && (
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <label className="mb-2 block font-medium text-black dark:text-white">
                Semestre activo
              </label>

              <select
                value={selectedSemesterId}
                onChange={(event) => setSelectedSemesterId(event.target.value)}
                className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
              >
                <option value="">Seleccione un semestre</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name} - {semester.code}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="mt-4 rounded bg-primary px-4 py-2 text-white"
                disabled={!selectedSemesterId}
                onClick={() => setCurrentStep(2)}
              >
                Continuar
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <input
                  type="text"
                  value={groupSearch}
                  onChange={(event) => setGroupSearch(event.target.value)}
                  placeholder="Buscar por nombre o código de grupo"
                  className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
                />
              </div>

              <EntityTable
                columns={groupColumns}
                data={filteredGroups}
                emptyMessage="No hay grupos disponibles para este semestre."
              />
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <div className="mb-4 rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
                <input
                  type="text"
                  value={teacherSearch}
                  onChange={(event) => setTeacherSearch(event.target.value)}
                  placeholder="Buscar docente por nombre, apellido o cédula"
                  className="w-full rounded border border-stroke px-4 py-2 dark:border-strokedark dark:bg-form-input"
                />
              </div>

              <EntityTable
                columns={teacherColumns}
                data={filteredTeachers}
                emptyMessage="No hay docentes activos disponibles."
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
              <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
                Confirmar asignación
              </h3>

              <div className="mb-6 space-y-2 text-sm">
                <p>
                  <strong>Semestre:</strong>{" "}
                  {selectedSemester?.name ?? "No seleccionado"}
                </p>
                <p>
                  <strong>Grupo:</strong>{" "}
                  {selectedGroup?.name ?? "No seleccionado"}
                </p>
                <p>
                  <strong>Asignatura:</strong>{" "}
                  {getSubjectName(selectedGroup?.subject_id)}
                </p>
                <p>
                  <strong>Docente:</strong>{" "}
                  {selectedTeacher
                    ? `${selectedTeacher.first_name ?? ""} ${
                        selectedTeacher.last_name ?? ""
                      }`
                    : "No seleccionado"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  className="rounded border border-stroke px-4 py-2"
                  onClick={() => setCurrentStep(3)}
                >
                  Atrás
                </button>

                <button
                  type="button"
                  className="rounded bg-primary px-4 py-2 text-white"
                  onClick={handleConfirmAssignment}
                >
                  Confirmar asignación
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
          <h3 className="mb-4 text-lg font-semibold text-black dark:text-white">
            Detalles del grupo
          </h3>

          {selectedGroup ? (
            <div className="space-y-2 text-sm">
              <p>
                <strong>Grupo:</strong> {selectedGroup.name}
              </p>
              <p>
                <strong>Código:</strong> {selectedGroup.group_code}
              </p>
              <p>
                <strong>Asignatura:</strong>{" "}
                {getSubjectName(selectedGroup.subject_id)}
              </p>
              <p>
                <strong>Docente actual:</strong>{" "}
                {getTeacherName(selectedGroup.teacher_id)}
              </p>
              <p>
                <strong>Cupos:</strong> {selectedGroup.capacity ?? "-"}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Seleccione un grupo para ver sus detalles.
            </p>
          )}
        </aside>
      </div>
    </>
  );
};

export default AssignTeacherToGroup;