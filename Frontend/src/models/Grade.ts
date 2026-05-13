/* Archivo: Frontend\src\models\Grade.ts
   Proposito: Implementa la logica principal del archivo Grade.
*/
export type GradeStatus = "draft" | "submitted" | "locked";

export interface Grade {
  id?: string;
  student_id: string;
  enrollment_id: string;
  evaluation_id: string;
  rubric_id: string;
  final_score: number;
  status: GradeStatus;
  observations?: string;
  is_locked: boolean;
}