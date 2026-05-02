/* Archivo: Frontend\src\models\Notification.ts
   Proposito: Implementa la logica principal del archivo Notification.
*/
export interface Notification {
    id?: string;
    recipient_user_id?: string;
    title?: string;
    message?: string;
    channel?: string;
    is_read?: boolean;
    read_at?: Date;
    created_at?: Date;
    updated_at?: Date;
}
