import { Registration } from "../models/Registration";
import { registrationService } from "../services/registrationService";

class RegistrationBusiness {
  private isValidAdmissionPeriod(period: string): boolean {
    return /^\d{4}-(0?[1-2])$/.test(period.trim());
  }

  async createRegistration(
    registration: Omit<Registration, "id">,
    existingRegistrations: Registration[]
  ): Promise<Registration | null> {
    if (!registration.student_id) {
      throw new Error("Debe seleccionar un estudiante.");
    }

    if (!registration.career_id) {
      throw new Error("Debe seleccionar una carrera.");
    }

    if (!registration.admission_period.trim()) {
      throw new Error("Debe ingresar el periodo de ingreso.");
    }

    if (!this.isValidAdmissionPeriod(registration.admission_period)) {
      throw new Error(
        "El periodo de ingreso debe tener formato válido. Ejemplo: 2026-01 o 2026-1."
      );
    }

    if (!registration.academic_status) {
      throw new Error("Debe seleccionar el estado académico inicial.");
    }

    const alreadyRegistered = existingRegistrations.some(
      (item) =>
        item.student_id === registration.student_id &&
        item.career_id === registration.career_id &&
        item.is_active
    );

    if (alreadyRegistered) {
      throw new Error(
        "El estudiante ya tiene una matrícula activa en esta carrera."
      );
    }

    return await registrationService.createRegistration({
      ...registration,
      admission_period: registration.admission_period.trim(),
      is_active: true,
    });
  }

  async updateAcademicStatus(
    registrationId: string,
    academicStatus: string
  ): Promise<Registration | null> {
    if (!registrationId) {
      throw new Error("Debe seleccionar una matrícula.");
    }

    if (!academicStatus) {
      throw new Error("Debe seleccionar el nuevo estado académico.");
    }

    return await registrationService.updateRegistration(registrationId, {
      academic_status: academicStatus,
      is_active: academicStatus === "ACTIVE",
    });
  }
}

export const registrationBusiness = new RegistrationBusiness();