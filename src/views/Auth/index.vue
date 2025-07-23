<template>
    <div class="bg-cineflix-dark-gray p-8 rounded-lg shadow-lg max-w-md w-full">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cineflix-red">CineFlix Login</h1>
        </div>

        <form @submit.prevent="handleLogin">
            <div class="mb-4">
                <label for="document" class="block text-cineflix-white text-sm font-bold mb-2">
                    Documento (CPF)
                </label>
                <input type="text" id="document" v-model="document" autocomplete="username"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Seu documento" />
            </div>

            <div class="mb-6">
                <label for="password" class="block text-cineflix-white text-sm font-bold mb-2">
                    Senha
                </label>
                <input type="password" id="password" v-model="password" autocomplete="current-password"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="********" />
            </div>

            <div v-if="loginError" class="bg-red-500 text-white p-2 rounded mb-4 text-center">
                {{ loginError }}
            </div>

            <div class="flex items-center justify-between">
                <button type="submit"
                    class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    Entrar
                </button>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/users';
import { useAuthStore } from '@/stores/auth';

const document = ref('');
const password = ref('');
const loginError = ref<string | null>(null);

const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
    loginError.value = null;

    const loggedInUser = userStore.login(document.value, password.value);

    if (loggedInUser) {
        authStore.setAuthenticatedUser(loggedInUser);
        console.log('Login bem-sucedido!', loggedInUser.name);
        router.push('/dashboard');
    } else {
        loginError.value = 'Documento ou senha inválidos, ou usuário inativo.';
        console.error('Falha no login');
    }
};
</script>

<style scoped>
/* Remover quaisquer estilos que tentem centralizar ou dar altura total */
</style>