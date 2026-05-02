/* Archivo: Frontend\src\models\Enrollment.ts
   Proposito: Implementa la logica principal del archivo Enrollment.
*/
export interface Enrollment {
    id?: string;
    student_id?: string;
    group_id?: string;
    enrollment_date?: Date;
    status?: string;
}