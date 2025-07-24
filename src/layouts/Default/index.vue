<template>
    <div class="min-h-screen flex flex-col bg-cineflix-black text-cineflix-white">
        <header class="bg-cineflix-dark-gray p-4 flex items-center justify-between shadow-md">
            <div class="flex items-center">
                <button @click="toggleMobileMenu" class="md:hidden text-cineflix-white mr-4">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <img src="../../assets/img/CineFlix.webp" width="100" alt="Logo CineFlix" class="mr-4">
                <h1 class="text-xl font-bold text-cineflix-red">CineFlix Admin</h1>
            </div>
            <nav class="hidden md:flex items-center space-x-4">
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

        <div class="flex flex-grow relative">
            <div v-if="isMobileMenuOpen" @click="toggleMobileMenu"
                class="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"></div>

            <aside :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'" class="fixed inset-y-0 left-0 w-64 bg-cineflix-dark-gray p-4 shadow-lg 
                          transform transition-transform duration-300 ease-in-out z-30 
                          md:relative md:translate-x-0 md:w-64">
                <nav>
                    <ul class="space-y-2">
                        <li>
                            <router-link to="/dashboard" @click="isMobileMenuOpen = false"
                                class="block p-2 rounded hover:bg-cineflix-red">Dashboard</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/users" @click="isMobileMenuOpen = false"
                                class="block p-2 rounded hover:bg-cineflix-red">Usuários</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/clients" @click="isMobileMenuOpen = false"
                                class="block p-2 rounded hover:bg-cineflix-red">Clientes</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/movies" @click="isMobileMenuOpen = false"
                                class="block p-2 rounded hover:bg-cineflix-red">Filmes</router-link>
                        </li>
                        <li>
                            <router-link to="/dashboard/rentals" @click="isMobileMenuOpen = false"
                                class="block p-2 rounded hover:bg-cineflix-red">Locações</router-link>
                        </li>
                        <li class="md:hidden border-t border-gray-700 pt-2 mt-2" v-if="authStore.user">
                            <span class="block px-2 text-sm text-gray-400">Olá, {{ authStore.user.name }}</span>
                            <button @click="handleLogout(); isMobileMenuOpen = false;"
                                class="bg-cineflix-red hover:bg-red-700 text-cineflix-white px-3 py-1 rounded mt-2 w-full">
                                Sair
                            </button>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main class="flex-grow p-6 w-full px-2 sm:px-4 md:px-2 lg:px-6">
                <slot></slot>
            </main>
        </div>

        <footer class="bg-cineflix-dark-gray p-4 text-center text-sm text-gray-400 shadow-inner">
            &copy; 2025 CineFlix. Todos os direitos reservados.
        </footer>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const router = useRouter();
const authStore = useAuthStore();
const route = useRoute();

const isMobileMenuOpen = ref(false);

const handleLogout = () => {
    authStore.logout();
    router.push('/auth');
};

const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Fechar o menu mobile ao navegar para uma nova rota
watch(() => route.path, () => {
    isMobileMenuOpen.value = false;
});
</script>

<style scoped>
.router-link-active {
    background-color: var(--color-cineflix-red);
    font-weight: bold;
}

/* No mobile, o link ativo da barra lateral pode precisar de uma cor de texto diferente se o fundo ficar vermelho */
.router-link-active.hover\:bg-cineflix-red {
    background-color: var(--color-cineflix-red);
    /* Garante que o fundo vermelho permaneça para o link ativo */
    color: var(--color-cineflix-white);
    /* Opcional: Garante que o texto seja branco no link ativo */
}
</style>