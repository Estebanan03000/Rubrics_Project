/* Archivo: Frontend\src\storage\StorageProvider.ts
   Proposito: Implementa la logica principal del archivo StorageProvider.
*/
export interface StorageProvider {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
    clear(): void;
}