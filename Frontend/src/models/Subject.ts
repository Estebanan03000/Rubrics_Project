/* Archivo: Frontend\src\models\Subject.ts
   Proposito: Implementa la logica principal del archivo Subject.
*/
export interface Subject {
    id?: string;
    name?: string;
    code?: string;
    description?: string;
    credits?: number;
    is_active?: boolean;
}
