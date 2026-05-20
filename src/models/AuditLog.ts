/* Archivo: Frontend\src\models\AuditLog.ts
   Proposito: Implementa la logica principal del archivo AuditLog.
*/
export interface AuditLog {
  id?: string;
  action: string;
  entity_name: string;
  entity_id?: string;
  detail?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
}