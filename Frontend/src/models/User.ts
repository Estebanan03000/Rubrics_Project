/* Archivo: Frontend\src\models\User.ts
   Proposito: Implementa la logica principal del archivo User.
*/
export interface User {
    id?: string;
    email?: string;
    password_hash?: string;
    code?: string;
    role?: string;
    is_active?: boolean;
}