/* Archivo: Frontend\src\models\Registration.ts
   Proposito: Implementa la logica principal del archivo Registration.
*/
export interface Registration {
  id?: string;
  student_id: string;
  career_id: string;
  admission_period: string;
  academic_status: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}