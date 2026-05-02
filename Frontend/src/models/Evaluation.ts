/* Archivo: Frontend\src\models\Evaluation.ts
   Proposito: Implementa la logica principal del archivo Evaluation.
*/
export interface Evaluation {
    id?: string;
    subject_id?: string;
    rubric_id?: string;
    group_id?: string;
    name?: string;
    description?: string;
    weight?: number;
}