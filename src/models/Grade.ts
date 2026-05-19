/* Archivo: Frontend\src\models\Grade.ts
   Proposito: Implementa la logica principal del archivo Grade.
*/

export type GradeStatus =
  | "draft"
  | "submitted"
  | "locked"
  | "DRAFT"
  | "SUBMITTED"
  | "LOCKED";

export interface GradeDetail {
  id?: string;
  student_id?: string;
  scale_id?: string;
  score: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Grade {
  id?: string;
  student_id?: string;
  enrollment_id: string;
  evaluation_id?: string;
  rubric_id: string;
  final_score: number;
  status: GradeStatus;
  observations?: string | null;
  is_locked: boolean;
  details?: GradeDetail[];
  created_at?: string;
  updated_at?: string;
}