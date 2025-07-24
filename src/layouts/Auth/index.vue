<template>
    <div class="min-h-screen flex flex-col bg-cineflix-black">
        <header>
            <img src="../../assets/img/CineFlix.webp" width="200" alt="CineFlix Logo" class="mx-auto">
        </header>

        <main class="flex-grow flex justify-center py-8 px-4 sm:px-6 md:px-8">
            <router-view />
        </main>

        <footer class="text-center text-gray-400 text-sm py-4">
            &copy; {{ new Date().getFullYear() }} CineFlix. Todos os direitos reservados.
        </footer>
    </div>
</template>

<script setup lang="ts">
// Nenhuma alteração aqui
</script>

<style scoped>
/* Nenhuma alteração aqui */
</style>