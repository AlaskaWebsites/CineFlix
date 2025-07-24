// src/stores/rentals.ts
import { defineStore } from 'pinia';
import type { Rental } from '@/types/Rental';
import { getFromLocalStorage, saveToLocalStorage } from '@/services/localStorageService';
import { generateUniqueId } from '@/utils/idGenerator';
import { useClientStore } from '@/stores/clients'; // Apenas importe, não instancie aqui
import { useAuthStore } from '@/stores/auth';

const RENTALS_STORAGE_KEY = 'cineflix_rentals';

interface RentalsState {
    rentals: Rental[];
    loading: boolean;
    error: string | null;
}

export const useRentalStore = defineStore('rental', {
    state: (): RentalsState => ({
        rentals: getFromLocalStorage<Rental>(RENTALS_STORAGE_KEY),
        loading: false,
        error: null,
    }),
    getters: {
        allRentals: (state) => state.rentals,
        getRentalById: (state) => (id: string) => state.rentals.find(rental => rental.id === id),
        // Retorna locações filtradas por cliente e datas
        filteredRentals: (state) => (clientFilter: string, rentalDateFilter: string, deliveryDateFilter: string) => {
            const clientStore = useClientStore(); // <-- MOVIDO PARA AQUI: Instanciado DENTRO do getter
            return state.rentals.filter(rental => {
                const client = clientStore.getClientById(rental.clientId);
                const clientFullName = client ? `${client.firstName} ${client.lastName}` : '';

                const matchesClient = clientFilter ? clientFullName.toLowerCase().includes(clientFilter.toLowerCase()) : true;
                const matchesRentalDate = rentalDateFilter ? rental.rentalDate.includes(rentalDateFilter) : true;
                const matchesDeliveryDate = deliveryDateFilter ? rental.deliveryDate.includes(deliveryDateFilter) : true;

                return matchesClient && matchesRentalDate && matchesDeliveryDate;
            });
        },
    },
    actions: {
        // ... (resto das actions: addRental, updateRental, markAsDelivered) ...
        /**
         * Adiciona uma nova locação.
         * @param rentalData Dados da locação, sem id, status e userId.
         */
        async addRental(rentalData: Omit<Rental, 'id' | 'status' | 'userId'>) {
            this.loading = true;
            this.error = null;

            const authStore = useAuthStore();
            const clientStore = useClientStore(); // Também instanciado aqui, dentro da action

            try {
                // Validação: Usuário logado é obrigatório para registrar locação
                if (!authStore.isLoggedIn || !authStore.currentUser?.id) {
                    throw new Error("Usuário não logado para registrar locação.");
                }

                // REGRA DE NEGÓCIO CRÍTICA: Clientes com uma locação em status 'alugado' não podem realizar outra locação
                const clientRentals = this.rentals.filter(r => r.clientId === rentalData.clientId);
                const hasActiveRental = clientRentals.some(r => r.status === 'rented');
                if (hasActiveRental) {
                    throw new Error("Este cliente já possui uma locação ativa (alugada) e não pode realizar outra.");
                }

                const newRental: Rental = {
                    id: generateUniqueId(),
                    status: 'rented',
                    userId: authStore.currentUser.id,
                    ...rentalData,
                };
                this.rentals.push(newRental);
                saveToLocalStorage(RENTALS_STORAGE_KEY, this.rentals);
                console.log("Nova locação adicionada:", newRental);
            } catch (e: any) {
                this.error = e.message || "Erro ao adicionar locação.";
                console.error("Erro na action addRental:", e);
                throw e;
            } finally {
                this.loading = false;
            }
        },

        // ... (restante das actions: updateRental, markAsDelivered) ...
        async updateRental(updatedRental: Rental) {
            this.loading = true;
            this.error = null;
            try {
                const index = this.rentals.findIndex(r => r.id === updatedRental.id);
                if (index !== -1) {
                    this.rentals[index] = updatedRental;
                    saveToLocalStorage(RENTALS_STORAGE_KEY, this.rentals);
                    console.log("Locação atualizada:", updatedRental);
                } else {
                    throw new Error("Locação não encontrada para atualização.");
                }
            } catch (e: any) {
                this.error = e.message || "Erro ao atualizar locação.";
                console.error("Erro na action updateRental:", e);
                throw e;
            } finally {
                this.loading = false;
            }
        },

        async markAsDelivered(rentalId: string) {
            this.loading = true;
            this.error = null;
            try {
                const rental = this.rentals.find(r => r.id === rentalId);
                if (rental) {
                    if (rental.status === 'rented') {
                        rental.status = 'delivered';
                        saveToLocalStorage(RENTALS_STORAGE_KEY, this.rentals);
                        console.log(`Locação ${rental.id} marcada como entregue.`);
                    } else {
                        throw new Error("Esta locação já foi entregue.");
                    }
                } else {
                    throw new Error("Locação não encontrada.");
                }
            } catch (e: any) {
                this.error = e.message || "Erro ao marcar como entregue.";
                console.error("Erro na action markAsDelivered:", e);
                throw e;
            } finally {
                this.loading = false;
            }
        },
    },
});