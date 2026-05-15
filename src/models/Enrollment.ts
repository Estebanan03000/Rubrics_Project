/* Archivo: Frontend\src\models\Enrollment.ts
   Proposito: Implementa la logica principal del archivo Enrollment.
*/
export type EnrollmentStatus = "active" | "cancelled";

export interface Enrollment {
  id?: string;
  student_id: string;
  group_id: string;
  enrollment_date: string;
  status: EnrollmentStatus;
}