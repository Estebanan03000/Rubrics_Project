/* Archivo: Frontend\src\models\Grade.ts
   Proposito: Implementa la logica principal del archivo Grade.
*/
export interface Grade {
    id?: string;
    enrollment_id?: string;
    rubric_id?: string;
    final_score?: number;
    status?: string;
    observations?: string;
    is_locked?: boolean;
}