/* Archivo: Frontend\src\models\Semester.ts
   Proposito: Implementa la logica principal del archivo Semester.
*/
export interface Semester {
    id?: string;
    career_id: string;
    name: string;
    code: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}