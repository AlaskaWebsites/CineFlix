// src/types/Rental.ts
export interface Rental {
    id: string;
    clientId: string; // ID do cliente que fez a locação
    movieIds: string[]; // Array de IDs dos filmes locados
    rentalDate: string; // Data de locação (ISO string ou outro formato)
    deliveryDate: string; // Data de entrega (ISO string ou outro formato)
    userId: string; // ID do usuário (funcionário) que fez a locação
    status: 'rented' | 'delivered'; // 'alugado' e 'entregue'
}