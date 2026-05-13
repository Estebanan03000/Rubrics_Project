/* Archivo: Frontend\src\models\GradeDetail.ts
   Proposito: Implementa la logica principal del archivo GradeDetail.
*/
export interface GradeDetail {
  id?: string;
  grade_id: string;
  criterion_id: string;
  scale_id: string;
  score: number;
  comment?: string;
}