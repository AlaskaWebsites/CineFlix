// src/services/localStorageService.ts

/**
 * Lê dados do Local Storage.
 * @param key Chave do Local Storage.
 * @returns Array de objetos ou array vazio se não houver dados.
 */
export function getFromLocalStorage<T>(key: string): T[] {
    try {
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T[]) : [];
    } catch (error) {
        console.error(`Erro ao ler ${key} do Local Storage:`, error);
        return [];
    }
}

/**
 * Salva dados no Local Storage.
 * @param key Chave do Local Storage.
 * @param data Array de objetos a ser salvo.
 */
export function saveToLocalStorage<T>(key: string, data: T[]): void {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error(`Erro ao salvar ${key} no Local Storage:`, error);
    }
}

/**
 * Remove um item do Local Storage.
 * @param key Chave do Local Storage.
 */
export function removeFromLocalStorage(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error(`Erro ao remover ${key} do Local Storage:`, error);
    }
}