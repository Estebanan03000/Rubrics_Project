import { Career } from "../models/Career";
import { Semester } from "../models/Semester";
import { careerService } from "../services/careerService";
import { semesterService } from "../services/semesterService";

class AcademicBusiness {
  async createCareer(career: Career): Promise<Career | null> {
    const careers = await careerService.getCareers();

    const codeExists = careers.some(
      (item) => item.code.toLowerCase() === career.code.toLowerCase()
    );

    if (codeExists) {
      throw new Error("Ya existe una carrera con ese código.");
    }

    return await careerService.createCareer({
      ...career,
      is_active: true,
    });
  }

  async updateCareer(id: string, career: Partial<Career>): Promise<Career | null> {
    return await careerService.updateCareer(id, career);
  }

  async archiveCareer(id: string): Promise<Career | null> {
    const semesters = await semesterService.getSemesters();

    const hasActiveSemester = semesters.some(
      (semester) => semester.career_id === id && semester.is_active === true
    );

    if (hasActiveSemester) {
      throw new Error("No se puede archivar una carrera con semestre activo.");
    }

    return await careerService.updateCareer(id, { is_active: false });
  }

  async createSemester(semester: Semester): Promise<Semester | null> {
    if (new Date(semester.start_date) >= new Date(semester.end_date)) {
      throw new Error("La fecha de inicio debe ser menor que la fecha de fin.");
    }

    const semesters = await semesterService.getSemesters();

    if (semester.is_active) {
      const activeSemester = semesters.find(
        (item) => item.career_id === semester.career_id && item.is_active === true
      );

      if (activeSemester?.id) {
        await semesterService.updateSemester(activeSemester.id, {
          is_active: false,
        });
      }
    }

    return await semesterService.createSemester(semester);
  }

    async updateSemester(
        id: string,
        semester: Partial<Semester>
    ): Promise<Semester | null> {
        if (
            semester.start_date &&
            semester.end_date &&
            new Date(semester.start_date + "T00:00:00") >=
            new Date(semester.end_date + "T00:00:00")
        ) {
            throw new Error("La fecha de inicio debe ser menor que la fecha de fin.");
        }

        if (semester.is_active && semester.career_id) {
            const semesters = await semesterService.getSemesters();

            const activeSemester = semesters.find(
            (item) =>
                item.career_id === semester.career_id &&
                item.is_active === true &&
                item.id !== id
            );

            if (activeSemester?.id) {
            await semesterService.updateSemester(activeSemester.id, {
                is_active: false,
            });
            }
        }

        return await semesterService.updateSemester(id, semester);
    }
}

export const academicBusiness = new AcademicBusiness();