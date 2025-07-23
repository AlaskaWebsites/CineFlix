<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold text-cineflix-red mb-6">Gerenciar Usuários (Funcionários)</h1>

        <div class="flex justify-end mb-4">
            <button @click="handleAddNewUser"
                class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded">
                Adicionar Novo Usuário
            </button>
        </div>

        <div v-if="users.length > 0" class="overflow-x-auto">
            <table class="min-w-full bg-cineflix-dark-gray rounded-lg shadow-md">
                <thead>
                    <tr class="text-cineflix-white text-left text-sm uppercase font-semibold tracking-wider">
                        <th class="py-3 px-6">Nome</th>
                        <th class="py-3 px-6">Documento</th>
                        <th class="py-3 px-6">Status</th>
                        <th class="py-3 px-6 text-center">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id" class="border-b border-gray-700 hover:bg-gray-700">
                        <td class="py-3 px-6">{{ user.name }}</td>
                        <td class="py-3 px-6">{{ user.document }}</td>
                        <td class="py-3 px-6">
                            <span
                                :class="{ 'text-green-400': user.status === 'active', 'text-red-400': user.status === 'inactive' }">
                                {{ user.status === 'active' ? 'Ativo' : 'Inativo' }}
                            </span>
                        </td>
                        <td class="py-3 px-6 text-center">
                            <button @click="handleEdit(user.id)"
                                class="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-xs mr-2">
                                Editar
                            </button>
                            <button @click="handleToggleStatus(user.id, user.status)"
                                :class="{ 'bg-red-600 hover:bg-red-700': user.status === 'active', 'bg-green-600 hover:bg-green-700': user.status === 'inactive' }"
                                class="text-white py-1 px-3 rounded text-xs">
                                {{ user.status === 'active' ? 'Desativar' : 'Ativar' }}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else class="text-center text-gray-500 mt-8">
            <p>Nenhum usuário cadastrado. Clique em "Adicionar Novo Usuário" para começar.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/users';
import type { User } from '@/types/User'; // Importe o tipo User

const userStore = useUserStore();
const router = useRouter();

// Usar computed para reagir a mudanças na lista de usuários da store
const users = computed(() => userStore.users);

// Opcional: Para garantir que os usuários sejam carregados no Local Storage na primeira vez que a página for acessada
onMounted(() => {
    // A store já carrega do Local Storage no state inicial, então não é estritamente necessário aqui,
    // mas pode ser útil se você adicionar alguma lógica de refresh
    // console.log("Usuários carregados:", users.value);
});

const handleAddNewUser = () => {
    router.push({ name: 'UserNew' }); // Redireciona para a rota de cadastro de novo usuário
};

const handleEdit = (userId: string) => {
    router.push({ name: 'UserEdit', params: { id: userId } }); // Redireciona para a rota de edição
};

const handleToggleStatus = (userId: string, currentStatus: 'active' | 'inactive') => {
    const userToUpdate = userStore.getUserById(userId);
    if (userToUpdate) {
        // Crie uma cópia do usuário para não modificar o objeto diretamente no estado do Pinia antes de atualizar
        const updatedUser: User = { ...userToUpdate, status: currentStatus === 'active' ? 'inactive' : 'active' };
        userStore.updateUser(updatedUser);
        console.log(`Usuário ${updatedUser.name} ${updatedUser.status === 'active' ? 'ativado' : 'desativado'}.`);
        // Opcional: Adicionar feedback visual de sucesso/falha
    }
};
</script>

<style scoped>
/* Adicione aqui qualquer estilo específico para a tabela ou botões */
</style>