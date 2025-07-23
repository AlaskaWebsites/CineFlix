<template>
    <div class="min-h-screen flex flex-col bg-cineflix-black text-cineflix-white">
        <header class="bg-cineflix-dark-gray p-4 flex items-center justify-between shadow-md">
            <div class="flex items-center">
                <img src="../../assets/img/CineFlix.webp" width="100" alt="Logo CineFlix" class="mr-4">
                <h1 class="text-xl font-bold text-cineflix-red">CineFlix Admin</h1>
            </div>
            <nav>
                <ul class="flex items-center space-x-4">
                    <li v-if="authStore.user">Olá, <span class="font-semibold">{{ authStore.user.name }}</span></li>
                    <li>
                        <button @click="handleLogout"
                            class="bg-cineflix-red hover:bg-red-700 text-cineflix-white px-3 py-1 rounded">
                            Sair
                        </button>
                    </li>
                </ul>
            </nav>
        </header>

        <div class="flex flex-grow">
            <aside class="w-64 bg-cineflix-dark-gray p-4 shadow-lg">
                <nav>
                    <ul class="space-y-2">
                        <li>
                            <router-link to="/dashboard"
                                class="block p-2 rounded hover:bg-cineflix-red-700">Dashboard</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/users"
                                class="block p-2 rounded hover:bg-cineflix-red-700">Usuários</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/clients"
                                class="block p-2 rounded hover:bg-cineflix-red-700">Clientes</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/movies"
                                class="block p-2 rounded hover:bg-cineflix-red-700">Filmes</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/rentals"
                                class="block p-2 rounded hover:bg-cineflix-red-700">Locações</router-link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main class="flex-grow p-6">
                <slot></slot>
            </main>
        </div>

        <footer class="bg-cineflix-dark-gray p-4 text-center text-sm text-gray-400 shadow-inner">
            &copy; 2025 CineFlix. Todos os direitos reservados.
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = () => {
    authStore.logout();
    router.push('/auth'); // Redireciona para a tela de login
};
</script>

<style scoped>
/* Estilos específicos se necessário, mas Tailwind deve ser suficiente */
/* Estilo para links ativos do router (pode ser configurado globalmente ou aqui) */
.router-link-active {
    background-color: var(--color-cineflix-red);
    /* Usando a variável de tema */
    font-weight: bold;
}
</style>