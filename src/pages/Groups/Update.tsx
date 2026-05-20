import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/Breadcrumb";

import { Group } from "../../models/Group";
import { Subject } from "../../models/Subject";
import { Semester } from "../../models/Semester";
import { Teacher } from "../../models/Teacher";

import { groupService } from "../../services/groupService";
import { subjectService } from "../../services/subjectService";
import { semesterService } from "../../services/semesterService";
import { teacherService } from "../../services/teacherService";

const UpdateGroup = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState<Group | null>(null);
  const [formData, setFormData] = useState<Group>({});

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      const [groupData, subjectsData, semestersData, teachersData] =
        await Promise.all([
          groupService.getGroupById(id),
          subjectService.getSubjects(),
          semesterService.getSemesters(),
          teacherService.getTeachers(),
        ]);

      if (groupData) {
        setGroup(groupData);
        setFormData(groupData);
      }

      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
      setSemesters(Array.isArray(semestersData) ? semestersData : []);
      setTeachers(Array.isArray(teachersData) ? teachersData : []);
    };

    loadData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value,
    }));
  };

  const handleUpdateGroup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    if (
      !formData.name ||
      !formData.group_code ||
      !formData.subject_id ||
      !formData.semester_id ||
      !formData.teacher_id ||
      !formData.capacity
    ) {
      Swal.fire(
        "Campos obligatorios",
        "Debes completar nombre, código, asignatura, semestre, docente y cupos.",
        "warning",
      );
      return;
    }

    if (Number(formData.capacity) <= 0) {
      Swal.fire("Cupos inválidos", "Los cupos deben ser mayores a cero.", "warning");
      return;
    }

    try {
      const updatedGroup = await groupService.updateGroup(id, formData);

      if (updatedGroup) {
        Swal.fire("Completado", "Se ha actualizado correctamente el grupo", "success");
        navigate("/groups/list");
      } else {
        Swal.fire("Error", "No se pudo actualizar el grupo.", "error");
      }
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          error?.response?.data?.detail ||
          "Existe un problema al momento de actualizar el grupo",
        "error",
      );
    }
  };

  if (!group) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Breadcrumb pageName="Actualizar Grupo" />

      <div className="mx-auto max-w-2xl rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="mb-6 font-medium text-black dark:text-white">
          Formulario de actualización
        </h3>

        <form onSubmit={handleUpdateGroup} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            placeholder="Nombre del grupo"
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <input
            type="text"
            name="group_code"
            value={formData.group_code || ""}
            onChange={handleChange}
            placeholder="Código del grupo"
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <input
            type="number"
            name="capacity"
            value={formData.capacity || 30}
            onChange={handleChange}
            placeholder="Cupos"
            min={1}
            className="w-full rounded border px-3 py-2 text-sm"
          />

          <select
            name="subject_id"
            value={formData.subject_id || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">Seleccione asignatura</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name} - {subject.code}
              </option>
            ))}
          </select>

          <select
            name="semester_id"
            value={formData.semester_id || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">Seleccione semestre</option>
            {semesters.map((semester) => (
              <option key={semester.id} value={semester.id}>
                {semester.name} - {semester.code}
              </option>
            ))}
          </select>

          <select
            name="teacher_id"
            value={formData.teacher_id || ""}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 text-sm"
          >
            <option value="">Seleccione docente</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.first_name} {teacher.last_name} - {teacher.identification}
              </option>
            ))}
          </select>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded bg-primary px-5 py-2 text-sm text-white"
            >
              Actualizar
            </button>

            <button
              type="button"
              onClick={() => navigate("/groups/list")}
              className="rounded border border-stroke px-5 py-2 text-sm"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UpdateGroup;