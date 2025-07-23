<template>
    <div class="bg-cineflix-dark-gray p-8 rounded-lg shadow-lg max-w-md w-full">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cineflix-red">CineFlix Registro de Funcionário</h1>
        </div>

        <form @submit.prevent="handleRegister">
            <div class="mb-4">
                <label for="name" class="block text-cineflix-white text-sm font-bold mb-2">
                    Nome Completo
                </label>
                <input type="text" id="name" v-model="name" autocomplete="name" :class="{ 'border-red-500': nameError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Nome completo do funcionário" />
                <p v-if="nameError" class="text-red-500 text-xs italic mt-1">{{ nameError }}</p>
            </div>

            <div class="mb-4">
                <label for="document" class="block text-cineflix-white text-sm font-bold mb-2">
                    Documento (CPF)
                </label>
                <input type="text" id="document" v-model="document" autocomplete="new-username"
                    :class="{ 'border-red-500': documentError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="CPF ou documento do funcionário" />
                <p v-if="documentError" class="text-red-500 text-xs italic mt-1">{{ documentError }}</p>
            </div>

            <div class="mb-6">
                <label for="password" class="block text-cineflix-white text-sm font-bold mb-2">
                    Senha
                </label>
                <input type="password" id="password" v-model="password" autocomplete="new-password"
                    :class="{ 'border-red-500': passwordError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Defina uma senha" />
                <p v-if="passwordError" class="text-red-500 text-xs italic mt-1">{{ passwordError }}</p>
            </div>

            <div v-if="registerError" class="bg-red-500 text-white p-2 rounded mb-4 text-center">
                {{ registerError }}
            </div>
            <div v-if="registerSuccess" class="bg-green-500 text-white p-2 rounded mb-4 text-center">
                {{ registerSuccess }}
            </div>

            <div class="flex items-center justify-between">
                <button type="submit"
                    class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    Registrar Funcionário
                </button>
            </div>

            <div class="text-center mt-4">
                <router-link to="/auth" class="text-blue-400 hover:text-blue-600 text-sm">
                    Já tem uma conta? Faça login aqui.
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/users';
import type { User } from '@/types/User'; // Importe o tipo User

const name = ref('');
const document = ref('');
const password = ref('');
const nameError = ref<string | null>(null);
const documentError = ref<string | null>(null);
const passwordError = ref<string | null>(null);
const registerError = ref<string | null>(null); // Erro geral do processo de registro
const registerSuccess = ref<string | null>(null); // Mensagem de sucesso

const userStore = useUserStore();
const router = useRouter();

const handleRegister = async () => {
    // Limpar mensagens e erros anteriores
    nameError.value = null;
    documentError.value = null;
    passwordError.value = null;
    registerError.value = null;
    registerSuccess.value = null;

    // Validação de campos obrigatórios
    let hasError = false;
    if (!name.value) {
        nameError.value = 'O nome é obrigatório.';
        hasError = true;
    }
    if (!document.value) {
        documentError.value = 'O documento (CPF) é obrigatório.';
        hasError = true;
    }
    if (!password.value) {
        passwordError.value = 'A senha é obrigatória.';
        hasError = true;
    }

    if (hasError) {
        return; // Para a execução se houver erros de validação de campo
    }

    // Validação: Verificar se o documento (CPF) já existe
    const existingUser = userStore.users.find(u => u.document === document.value);
    if (existingUser) {
        documentError.value = 'Este documento (CPF) já está cadastrado.'; // Erro no campo específico
        registerError.value = 'Falha no registro: Documento já utilizado.'; // Erro geral
        return;
    }

    // Preparar os dados para a store
    const newUser: Omit<User, 'id' | 'status'> = {
        name: name.value,
        document: document.value,
        password: password.value,
    };

    try {
        userStore.addUser(newUser); // Ação que adiciona e salva no Local Storage
        registerSuccess.value = 'Funcionário registrado com sucesso! Redirecionando para o login...';

        // Opcional: Limpar formulário após o registro bem-sucedido
        name.value = '';
        document.value = '';
        password.value = '';

        // Redireciona para a tela de login após um pequeno atraso
        setTimeout(() => {
            router.push('/auth');
        }, 2000); // 2 segundos para o usuário ler a mensagem de sucesso

    } catch (e) {
        console.error("Erro ao registrar funcionário:", e);
        registerError.value = 'Ocorreu um erro inesperado ao tentar registrar.';
    }
};
</script>

<style scoped>
/* Seus estilos específicos aqui, se houver */
</style>