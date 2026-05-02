/* Archivo: Frontend\src\storage\LocalStorageProvider.ts
   Proposito: Implementa la logica principal del archivo LocalStorageProvider.
*/
import { StorageProvider } from "./StorageProvider";

export class LocalStorageProvider implements StorageProvider {
    getItem(key: string): string | null {
        return localStorage.getItem(key);
    }

    setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeItem(key: string): void {
        localStorage.removeItem(key);
    }

    clear(): void {
        localStorage.clear();
    }
}