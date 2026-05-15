/* Archivo: Frontend\src\models\StudyPlan.ts
   Proposito: Implementa la logica principal del archivo StudyPlan.
*/
export interface StudyPlan {
    id?: string;
    career_id: string;
    name: string;
    year: number;
    is_published: boolean;
    is_active?: boolean;
}
