<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold text-cineflix-red mb-6">Gerenciar Locações</h1>

        <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <input type="text" v-model="clientFilter" placeholder="Buscar por Cliente"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-white bg-cineflix-dark-gray leading-tight focus:outline-none focus:shadow-outline flex-grow md:w-auto" />
            <input type="date" v-model="rentalDateFilter"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-white bg-cineflix-dark-gray leading-tight focus:outline-none focus:shadow-outline flex-grow md:w-auto" />
            <input type="date" v-model="deliveryDateFilter"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-white bg-cineflix-dark-gray leading-tight focus:outline-none focus:shadow-outline flex-grow md:w-auto" />

            <button @click="handleAddNewRental"
                class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded w-full md:w-auto">
                Registrar Nova Locação
            </button>
        </div>

        <div v-if="rentalStore.loading" class="text-center text-cineflix-white mb-4">
            <p>Carregando locações...</p>
        </div>

        <div v-if="rentalStore.error" class="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {{ rentalStore.error }}
        </div>

        <div v-if="filteredRentalsList.length > 0" class="overflow-x-auto">
            <table class="min-w-full bg-cineflix-dark-gray rounded-lg shadow-md">
                <thead>
                    <tr class="text-cineflix-white text-left text-sm uppercase font-semibold tracking-wider">
                        <th class="py-3 px-6">Cliente</th>
                        <th class="py-3 px-6">Filmes</th>
                        <th class="py-3 px-6">Locado em</th>
                        <th class="py-3 px-6">Entrega em</th>
                        <th class="py-3 px-6">Funcionário</th>
                        <th class="py-3 px-6">Status</th>
                        <th class="py-3 px-6 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="rental in filteredRentalsList" :key="rental.id"
                        class="border-b border-gray-700 hover:bg-gray-700">
                        <td class="py-3 px-6">{{ getClientName(rental.clientId) }}</td>
                        <td class="py-3 px-6">
                            {{ rental.movieIds.length }} filme(s)
                        </td>
                        <td class="py-3 px-6">{{ rental.rentalDate }}</td>
                        <td class="py-3 px-6">{{ rental.deliveryDate }}</td>
                        <td class="py-3 px-6">{{ getUserName(rental.userId) }}</td>
                        <td class="py-3 px-6">
                            <span
                                :class="{ 'text-yellow-400': rental.status === 'rented', 'text-green-400': rental.status === 'delivered' }">
                                {{ rental.status === 'rented' ? 'Alugado' : 'Entregue' }}
                            </span>
                        </td>
                        <td class="py-3 px-6 text-center">
                            <button v-if="rental.status === 'rented'" @click="handleMarkAsDelivered(rental.id)"
                                class="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-xs">
                                Marcar como Entregue
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="!rentalStore.loading && !rentalStore.error" class="text-center text-gray-500 mt-8">
            <p>Nenhuma locação encontrada. Registre uma nova locação ou ajuste os filtros.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useRentalStore } from '@/stores/rentals';
import { useClientStore } from '@/stores/clients'; // Para obter nome do cliente
import { useUserStore } from '@/stores/users';     // Para obter nome do funcionário

const rentalStore = useRentalStore();
const clientStore = useClientStore(); // Instância para buscar nome do cliente
const userStore = useUserStore();     // Instância para buscar nome do funcionário
const router = useRouter();

// Filtros
const clientFilter = ref('');
const rentalDateFilter = ref('');
const deliveryDateFilter = ref('');

// Lista de locações filtrada e computada
const filteredRentalsList = computed(() => {
    return rentalStore.filteredRentals(
        clientFilter.value,
        rentalDateFilter.value,
        deliveryDateFilter.value
    );
});

// Funções auxiliares para exibir nomes de IDs
const getClientName = (clientId: string) => {
    const client = clientStore.getClientById(clientId);
    return client ? `${client.firstName} ${client.lastName}` : 'Cliente Desconhecido';
};

const getUserName = (userId: string) => {
    const user = userStore.getUserById(userId);
    return user ? user.name : 'Funcionário Desconhecido';
};

const handleAddNewRental = () => {
    router.push({ name: 'RentalNew' }); // Redireciona para a rota de nova locação
};

const handleMarkAsDelivered = (rentalId: string) => {
    try {
        rentalStore.markAsDelivered(rentalId);
        // Opcional: Adicionar feedback visual de sucesso/falha
        console.log(`Locação ${rentalId} marcada como entregue!`);
    } catch (e: any) {
        console.error("Erro ao marcar como entregue:", e);
        // Opcional: Exibir erro na UI
    }
};
</script>

<style scoped>
/* Adicione estilos específicos aqui, se necessário */
</style>