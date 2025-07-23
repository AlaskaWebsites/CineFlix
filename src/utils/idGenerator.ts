// src/utils/idGenerator.ts
import { v4 as uuidv4 } from 'uuid'; // Instale 'uuid': npm install uuid @types/uuid

export function generateUniqueId(): string {
    return uuidv4(); // Gera um UUID v4
}