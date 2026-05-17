/* Archivo: Frontend\src\models\User.ts
   Proposito: Implementa la logica principal del archivo User.
*/
export enum UserRole {
    ADMIN = 'ADMIN',
    TEACHER = 'TEACHER',
    STUDENT = 'STUDENT',
}

export interface UserProfile {
    id?: string;

    first_name?: string;
    last_name?: string;

    identification?: string;

    phone?: string;
    specialty?: string;
}

export interface User {
    id?: string;

    email?: string;
    password?: string;

    code?: string;

    role?: UserRole;

    is_active?: boolean;

    profile?: UserProfile;

    created_at?: string;
    updated_at?: string;
}