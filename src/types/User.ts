// src/types/User.ts
export interface User {
    id: string; // Gerar UUIDs ou IDs sequenciais
    name: string;
    document: string; // CPF ou outro documento
    password: string; // Em um cenário real, nunca armazenaríamos senhas em plain text
    status: 'active' | 'inactive'; // 'ativo' e 'inativo'
}