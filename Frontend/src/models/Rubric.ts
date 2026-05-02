/* Archivo: Frontend\src\models\Rubric.ts
   Proposito: Implementa la logica principal del archivo Rubric.
*/
export interface Rubric {
    id?: string;
    subject_id?: string;
    title?: string;
    description?: string;
    is_public?: boolean;
    is_archived?: boolean;
}