import { OfficialFinalGrade } from '../models/FinalGrade';

const STORAGE_KEY = 'frontend_final_grades';

class FinalGradeService {
  getFinalGrades(): OfficialFinalGrade[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  }

  getByEnrollmentId(enrollmentId: string): OfficialFinalGrade | null {
    return (
      this.getFinalGrades().find(
        (grade) => grade.enrollment_id === enrollmentId,
      ) || null
    );
  }

  isEnrollmentFinalized(enrollmentId: string): boolean {
    return this.getByEnrollmentId(enrollmentId)?.is_finalized === true;
  }

  saveFinalGrade(data: OfficialFinalGrade): OfficialFinalGrade {
    const grades = this.getFinalGrades();

    const existingIndex = grades.findIndex(
      (grade) => grade.enrollment_id === data.enrollment_id,
    );

    const finalGrade: OfficialFinalGrade = {
      ...data,
      id: data.id || crypto.randomUUID(),
      is_finalized: true,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      grades[existingIndex] = finalGrade;
    } else {
      grades.unshift(finalGrade);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(grades));

    return finalGrade;
  }

  saveManyFinalGrades(grades: OfficialFinalGrade[]) {
    grades.forEach((grade) => this.saveFinalGrade(grade));
  }
}

export const finalGradeService = new FinalGradeService();