import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AcademicHeader from "../../components/academic/AcademicHeader";
import EntityTable, { TableColumn } from "../../components/academic/EntityTable";

import { Group } from "../../models/Group";
import { Subject } from "../../models/Subject";
import { Teacher } from "../../models/Teacher";

import { groupService } from "../../services/groupService";
import { subjectService } from "../../services/subjectService";
import { teacherService } from "../../services/teacherService";

const GroupsList: React.FC = () => {
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [groupsResponse, subjectsResponse, teachersResponse] =
        await Promise.all([
          groupService.getGroups(),
          subjectService.getSubjects(),
          teacherService.getTeachers(),
        ]);

      setGroups(groupsResponse);
      setSubjects(subjectsResponse);
      setTeachers(teachersResponse);
    } catch {
      await Swal.fire("Error", "No se pudieron cargar los grupos.", "error");
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

  const columns: TableColumn<Group>[] = [
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
      header: "Docente",
      render: (group) => getTeacherName(group.teacher_id),
    },
    {
      header: "Acciones",
      render: (group) => (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/groups/update/${group.id}`)}
            className="rounded border border-stroke px-3 py-1 text-sm"
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => navigate(`/groups/assign-teacher?groupId=${group.id}`)}
            className="rounded bg-primary px-3 py-1 text-sm text-white"
          >
            Asignar docente
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AcademicHeader
        title="Lista de grupos"
        description="Consulta los grupos registrados y asigna docentes."
        buttonText="Crear grupo"
        onButtonClick={() => navigate("/groups/create")}
      />

      <EntityTable
        columns={columns}
        data={groups}
        emptyMessage="No hay grupos registrados."
      />
    </>
  );
};

export default GroupsList;