import { Group } from "../models/Group";
import { Semester } from "../models/Semester";
import { Teacher } from "../models/Teacher";
import { groupService } from "../services/groupService";
import { semesterService } from "../services/semesterService";
import { teacherService } from "../services/teacherService";

class GroupAssignmentBusiness {
  async getActiveSemesters(): Promise<Semester[]> {
    const semesters = await semesterService.getSemesters();
    return semesters.filter((semester) => semester.is_active === true);
  }

  async getAssignableGroupsBySemester(semesterId: string): Promise<Group[]> {
    const groups = await groupService.getGroups();

    return groups.filter(
      (group) =>
        group.semester_id === semesterId &&
        group.subject_id !== undefined &&
        group.subject_id !== null &&
        group.subject_id !== ""
    );
  }

  async getAvailableTeachers(): Promise<Teacher[]> {
    const teachers = await teacherService.getTeachers();

    return teachers.filter((teacher) => teacher.is_active !== false);
  }

  async assignTeacherToGroup(
    groupId: string,
    teacherId: string
  ): Promise<Group | null> {
    if (!groupId) {
      throw new Error("Debe seleccionar un grupo.");
    }

    if (!teacherId) {
      throw new Error("Debe seleccionar un docente.");
    }

    const group = await groupService.getGroupById(groupId);

    if (!group) {
      throw new Error("El grupo seleccionado no existe.");
    }

    if (!group.subject_id) {
      throw new Error(
        "El grupo no tiene asignatura definida. Complete la información del grupo primero."
      );
    }

    if (!group.semester_id) {
      throw new Error("El grupo no tiene semestre definido.");
    }

    if (group.teacher_id === teacherId) {
      throw new Error("El docente seleccionado ya está asignado a este grupo.");
    }

    const teacher = await teacherService.getTeacherById(teacherId);

    if (!teacher) {
      throw new Error("El docente seleccionado no existe.");
    }

    if (teacher.is_active === false) {
      throw new Error("El docente seleccionado no está activo.");
    }

    const groups = await groupService.getGroups();

    const duplicatedAssignment = groups.find(
      (item) =>
        item.id !== group.id &&
        item.teacher_id === teacherId &&
        item.subject_id === group.subject_id &&
        item.semester_id === group.semester_id
    );

    if (duplicatedAssignment) {
      throw new Error(
        "El docente ya tiene otro grupo con la misma asignatura en este semestre."
      );
    }

    return await groupService.updateGroup(groupId, {
      teacher_id: teacherId,
    });
  }
}

export const groupAssignmentBusiness = new GroupAssignmentBusiness();