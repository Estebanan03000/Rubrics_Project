/* Archivo: Frontend\src\models\Criterion.ts
   Proposito: Implementa la logica principal del archivo Criterion.
*/
import { Scale } from "./Scale";
export interface Criterion {
  id: string;
  rubric_id: string;
  name: string;
  description: string;
  weight: number;
  scales?: Scale[];
}