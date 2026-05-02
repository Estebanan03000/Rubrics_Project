/* Archivo: Frontend\src\models\Semester.ts
   Proposito: Implementa la logica principal del archivo Semester.
*/
export interface Semester {
    id?: string;
    name?: string;
    code?: string;
    start_date?: Date;
    end_date?: Date;
    is_active?: boolean;
}