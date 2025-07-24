<template>
    <div class="p-4">
        <h1 class="text-3xl font-bold text-cineflix-red mb-6">Gerenciar Filmes (OMDb)</h1>

        <div class="flex flex-col md:flex-row gap-4 mb-6">
            <input type="text" v-model="searchTitle" placeholder="Buscar filme por título..."
                @keyup.enter="handleSearch"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline flex-grow" />
            <input type="text" v-model="searchYear" placeholder="Ano (ex: 2023)" @keyup.enter="handleSearch"
                class="shadow appearance-none border rounded py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline w-32" />
            <button @click="handleSearch" :disabled="movieStore.isLoading"
                class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                {{ movieStore.isLoading ? 'Buscando...' : 'Buscar' }}
            </button>
        </div>

        <div v-if="movieStore.isLoading" class="text-center text-cineflix-white mb-4">
            <p>Carregando filmes...</p>
        </div>

        <div v-if="movieStore.getErrorMessage" class="bg-red-500 text-white p-3 rounded mb-4 text-center">
            {{ movieStore.getErrorMessage }}
        </div>

        <div v-if="movieStore.getMovies.length > 0"
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            <div v-for="movie in movieStore.getMovies" :key="movie.imdbID"
                class="bg-cineflix-dark-gray rounded-lg shadow-lg overflow-hidden text-cineflix-white">
                <img :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=Poster+N/A'"
                    alt="Pôster do Filme" class="w-full h-auto object-cover" />
                <div class="p-3">
                    <h3 class="font-semibold text-lg truncate">{{ movie.Title }}</h3>
                    <p class="text-sm text-gray-400">{{ movie.Year }}</p>
                </div>
            </div>
        </div>

        <div v-else-if="!movieStore.isLoading && !movieStore.getErrorMessage" class="text-center text-gray-500 mt-8">
            <p>Nenhum filme encontrado. Use a busca acima para encontrar filmes.</p>
        </div>

        <div v-if="movieStore.hasMorePages && !movieStore.isLoading" class="text-center mt-6">
            <button @click="movieStore.loadMoreMovies()"
                class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Carregar Mais Filmes
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMovieStore } from '@/stores/movies';
import { useRouter } from 'vue-router'; // Apenas para consistência, não usado ativamente aqui

const movieStore = useMovieStore();

const searchTitle = ref('');
const searchYear = ref('');

// Para testar rapidamente, você pode inicializar com um filme popular
onMounted(() => {
    // Busca inicial de filmes ao carregar a página
    // Pode usar um valor persistido na store ou um padrão
    if (movieStore.lastSearchTitle) {
        searchTitle.value = movieStore.lastSearchTitle;
        searchYear.value = movieStore.lastSearchYear;
        movieStore.fetchMovies(searchTitle.value, searchYear.value, movieStore.currentPage);
    } else {
        // Busca inicial padrão se não houver busca anterior
        movieStore.fetchMovies('Matrix', '1999'); // Exemplo
    }
});

const handleSearch = () => {
    movieStore.fetchMovies(searchTitle.value, searchYear.value);
};
</script>

<style scoped>
/* Adicione estilos específicos aqui, se necessário */
</style>