<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold text-cineflix-red mb-6">Gerenciar Clientes</h1>

        <div class="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
            <input type="text" v-model="nameFilter" placeholder="Buscar por Nome"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline flex-grow md:w-auto" />
            <input type="text" v-model="documentFilter" placeholder="Buscar por CPF"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline flex-grow md:w-auto" />
            <select v-model="statusFilter"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline flex-grow md:w-auto">
                <option value="all">Todos os Status</option>
                <option value="active">Ativos</option>
                <option value="inactive">Inativos</option>
            </select>

            <button @click="handleAddNewClient"
                class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded w-full md:w-auto">
                Adicionar Novo Cliente
            </button>
        </div>

        <div v-if="filteredClientsList.length > 0" class="overflow-x-auto">
            <table class="min-w-full bg-cineflix-dark-gray rounded-lg shadow-md">
                <thead>
                    <tr class="text-cineflix-white text-left text-sm uppercase font-semibold tracking-wider">
                        <th class="py-3 px-6">Nome Completo</th>
                        <th class="py-3 px-6">CPF</th>
                        <th class="py-3 px-6">Email</th>
                        <th class="py-3 px-6">Telefone</th>
                        <th class="py-3 px-6">Status</th>
                        <th class="py-3 px-6 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="client in filteredClientsList" :key="client.id"
                        class="border-b border-gray-700 hover:bg-gray-700">
                        <td class="py-3 px-6">{{ client.firstName }} {{ client.lastName }}</td>
                        <td class="py-3 px-6">{{ client.cpf }}</td>
                        <td class="py-3 px-6">{{ client.email }}</td>
                        <td class="py-3 px-6">{{ client.phone }}</td>
                        <td class="py-3 px-6">
                            <span
                                :class="{ 'text-green-400': client.status === 'active', 'text-red-400': client.status === 'inactive' }">
                                {{ client.status === 'active' ? 'Ativo' : 'Inativo' }}
                            </span>
                        </td>
                        <td class="py-3 px-6 text-center">
                            <button @click="handleEdit(client.id)"
                                class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs mr-2">
                                Editar
                            </button>
                            <button @click="handleToggleStatus(client.id, client.status)"
                                :class="{ 'bg-red-600 hover:bg-red-700': client.status === 'active', 'bg-green-600 hover:bg-green-700': client.status === 'inactive' }"
                                class="text-white py-1 px-3 rounded text-xs">
                                {{ client.status === 'active' ? 'Desativar' : 'Ativar' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-center text-gray-500 mt-8">
            <p>Nenhum cliente cadastrado. Clique em "Adicionar Novo Cliente" para começar.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useClientStore } from '@/stores/clients';

const clientStore = useClientStore();
const router = useRouter();

// Filtros
const nameFilter = ref('');
const documentFilter = ref('');
const statusFilter = ref<'active' | 'inactive' | 'all'>('all');

// Lista de clientes filtrada e computada
const filteredClientsList = computed(() => {
    return clientStore.allClients.filter(client => {
        const matchesName = client.firstName.toLowerCase().includes(nameFilter.value.toLowerCase()) ||
            client.lastName.toLowerCase().includes(nameFilter.value.toLowerCase());
        const matchesDocument = client.cpf.includes(documentFilter.value);
        const matchesStatus = statusFilter.value === 'all' || client.status === statusFilter.value;

        return matchesName && matchesDocument && matchesStatus;
    });
});

const handleAddNewClient = () => {
    router.push({ name: 'ClientNew' });
};

const handleEdit = (clientId: string) => {
    router.push({ name: 'ClientEdit', params: { id: clientId } });
};

const handleToggleStatus = (clientId: string, currentStatus: 'active' | 'inactive') => {
    clientStore.toggleClientStatus(clientId, currentStatus);
    // Opcional: Adicionar feedback visual de sucesso/falha aqui
};
</script>

<style scoped>
/* Adicione aqui qualquer estilo específico para a tabela ou botões */
</style>