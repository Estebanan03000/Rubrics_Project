/* Archivo: Frontend\src\models\AuditLog.ts
   Proposito: Implementa la logica principal del archivo AuditLog.
*/
export interface AuditLog {
    id?: string;
    actor_user_id?: string;
    action?: string;
    entity_name?: string;
    entity_id?: string;
    detail?: string;
    ip_address?: string;
    created_at?: Date;
    updated_at?: Date;
}
