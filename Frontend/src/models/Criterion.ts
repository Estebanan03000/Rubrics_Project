/* Archivo: Frontend\src\models\Criterion.ts
   Proposito: Implementa la logica principal del archivo Criterion.
*/
export interface Criterion {
    id?: string;
    rubric_id?: string;
    name?: string;
    description?: string;
    weight?: number;
}