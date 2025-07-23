<template>
    <div class="min-h-screen flex flex-col bg-cineflix-black">
        <header class="bg-cineflix-black p-4 flex justify-center items-center">
            <img src="../../assets/img/CineFlix.png" width="150" alt="Logo CineFlix">
        </header>

        <main class="flex-grow flex justify-center pt-8 pb-8">
            <slot></slot>
        </main>
    </div>
</template>

<style scoped>
/* Sem alterações */
</style>