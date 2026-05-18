/* Archivo: Frontend\src\models\Rubric.ts
   Proposito: Implementa la logica principal del archivo Rubric.
*/
import { Criterion } from "./Criterion";
export interface Rubric {
  id?: string;
  title: string;
  description: string;
  is_public: boolean;
  is_archived?: boolean;
  name?: string;
  criteria?: Criterion[];
}