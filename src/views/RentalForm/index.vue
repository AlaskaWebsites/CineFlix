<template>
    <div class="bg-cineflix-dark-gray p-8 rounded-lg shadow-lg max-w-2xl w-full mx-auto">
        <div class="text-center mb-6">
            <h1 class="text-3xl font-bold text-cineflix-red">
                {{ isEditMode ? 'Editar Locação' : 'Registrar Nova Locação' }}
            </h1>
        </div>

        <form @submit.prevent="handleSubmit">
            <div class="mb-4">
                <label for="client" class="block text-cineflix-white text-sm font-bold mb-2">
                    Cliente
                </label>
                <select id="client" v-model="formData.clientId" :class="{ 'border-red-500': clientIdError }"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                    required>
                    <option value="" disabled>Selecione um cliente</option>
                    <option v-for="client in availableClients" :key="client.id" :value="client.id">
                        {{ client.firstName }} {{ client.lastName }} (CPF: {{ client.cpf }})
                    </option>
                </select>
                <p v-if="clientIdError" class="text-red-500 text-xs italic mt-1">{{ clientIdError }}</p>
                <p v-if="clientActiveRentalError" class="text-red-500 text-xs italic mt-1">
                    {{ clientActiveRentalError }}
                </p>
            </div>

            <div class="mb-6 border border-gray-700 p-4 rounded-lg">
                <h2 class="text-xl font-semibold text-cineflix-white mb-3">Selecionar Filmes</h2>
                <div class="flex flex-col md:flex-row gap-4 mb-4">
                    <input type="text" v-model="searchMovieTitle" placeholder="Buscar filme por título..."
                        @keyup.enter="handleMovieSearch"
                        class="shadow appearance-none border rounded py-2 px-3 text-cineflix-white bg-cineflix-dark-gray leading-tight focus:outline-none focus:shadow-outline flex-grow" />
                    <input type="text" v-model="searchMovieYear" placeholder="Ano" @keyup.enter="handleMovieSearch"
                        class="shadow appearance-none border rounded py-2 px-3 text-cineflix-white bg-cineflix-dark-gray leading-tight focus:outline-none focus:shadow-outline w-24" />
                    <button type="button" @click="handleMovieSearch" :disabled="movieStore.isLoading"
                        class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        {{ movieStore.isLoading ? 'Buscando...' : 'Buscar' }}
                    </button>
                </div>

                <div v-if="movieStore.isLoading" class="text-center text-cineflix-white mb-2">
                    <p>Buscando filmes...</p>
                </div>
                <div v-if="movieStore.getErrorMessage" class="bg-red-500 text-white p-2 rounded mb-2">
                    {{ movieStore.getErrorMessage }}
                </div>
                <div v-if="movieStore.getMovies.length > 0"
                    class="max-h-60 overflow-y-auto border border-gray-600 rounded">
                    <div v-for="movie in movieStore.getMovies" :key="movie.imdbID"
                        class="flex items-center p-2 border-b border-gray-700 last:border-b-0 hover:bg-gray-700">
                        <img :src="movie.Poster !== 'N/A' ? movie.Poster : 'https://placehold.co/50x75?text=N/A'"
                            alt="Pôster" class="w-10 h-15 mr-3 object-cover rounded"
                            @error="e => (e.target as HTMLImageElement).src = 'https://placehold.co/50x75?text=N/A'" />
                        <div class="flex-grow">
                            <p class="font-semibold text-cineflix-white">{{ movie.Title }} ({{ movie.Year }})</p>
                        </div>
                        <button type="button" @click="addMovieToRental(movie)" :disabled="isMovieSelected(movie.imdbID)"
                            class="bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs">
                            {{ isMovieSelected(movie.imdbID) ? 'Adicionado' : 'Adicionar' }}
                        </button>
                    </div>
                </div>
                <div v-else-if="!movieStore.isLoading && !movieStore.getErrorMessage && searchMovieTitle"
                    class="text-center text-gray-500 mt-2">
                    Nenhum filme encontrado para a busca.
                </div>
                <p v-if="movieIdsError" class="text-red-500 text-xs italic mt-1">{{ movieIdsError }}</p>

                <h3 class="font-semibold text-cineflix-white mt-4 mb-2">Filmes Selecionados:</h3>
                <div v-if="selectedMovies.length > 0" class="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                    <div v-for="movie in selectedMovies" :key="movie.imdbID"
                        class="bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center">
                        {{ movie.Title }}
                        <button type="button" @click="removeMovieFromRental(movie.imdbID)"
                            class="ml-1 text-white hover:text-gray-200">
                            &times;
                        </button>
                    </div>
                </div>
                <div v-else class="text-gray-500 text-sm">Nenhum filme selecionado.</div>
            </div>

            <div class="mb-4 flex flex-col md:flex-row md:space-x-4">
                <div class="flex-1 mb-4 md:mb-0">
                    <label for="rentalDate" class="block text-cineflix-white text-sm font-bold mb-2">
                        Data de Locação
                    </label>
                    <input type="date" id="rentalDate" v-model="formData.rentalDate"
                        :class="{ 'border-red-500': rentalDateError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        required />
                    <p v-if="rentalDateError" class="text-red-500 text-xs italic mt-1">{{ rentalDateError }}</p>
                </div>
                <div class="flex-1">
                    <label for="deliveryDate" class="block text-cineflix-white text-sm font-bold mb-2">
                        Data de Entrega
                    </label>
                    <input type="date" id="deliveryDate" v-model="formData.deliveryDate"
                        :class="{ 'border-red-500': deliveryDateError }"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-cineflix-black leading-tight focus:outline-none focus:shadow-outline"
                        required />
                    <p v-if="deliveryDateError" class="text-red-500 text-xs italic mt-1">{{ deliveryDateError }}</p>
                </div>
            </div>

            <div v-if="formError" class="bg-red-500 text-white p-2 rounded mb-4 text-center">
                {{ formError }}
            </div>
            <div v-if="formSuccess" class="bg-green-500 text-white p-2 rounded mb-4 text-center">
                {{ formSuccess }}
            </div>

            <div class="flex items-center justify-between">
                <button type="submit"
                    class="bg-cineflix-red hover:bg-red-700 text-cineflix-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    Registrar Locação
                </button>
            </div>

            <div class="text-center mt-4">
                <router-link to="/dashboard/rentals" class="text-blue-400 hover:text-blue-600 text-sm">
                    Voltar para a lista de Locações
                </router-link>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRentalStore } from '@/stores/rentals';
import { useClientStore } from '@/stores/clients';
import { useMovieStore } from '@/stores/movies';
// import { useAuthStore } from '@/stores/auth';

// Removido imports não utilizados para silenciar avisos do linter
// import type { Client } from '@/types/Client'; // Este tipo não é necessário aqui
// import type { MovieDetails } from '@/types/Movie'; // MovieDetails não é usado diretamente

// Removido imports não utilizados para silenciar avisos do linter, re-adicionando os necessários
import type { Rental } from '@/types/Rental'; // <-- AGORA É NECESSÁRIO!
import type { MovieSearchResult } from '@/types/Movie';

// Props para o modo de edição (se for implementado)
const props = defineProps<{
    id?: string;
}>();

const router = useRouter();
// const route = useRoute();
const rentalStore = useRentalStore();
const clientStore = useClientStore();
const movieStore = useMovieStore();
// const authStore = useAuthStore();

// Define o tipo para os dados do formulário, garantindo todas as propriedades necessárias de Rental
interface RentalFormInputs extends Omit<Rental, 'id' | 'userId' | 'status'> {
    clientId: string;
    movieIds: string[];
    rentalDate: string;
    deliveryDate: string;
}

// Estado do formulário
const formData = ref<RentalFormInputs>({
    clientId: '',
    movieIds: [],
    rentalDate: new Date().toISOString().slice(0, 10),
    deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10),
});

// Mensagens de erro por campo
const clientIdError = ref<string | null>(null);
const movieIdsError = ref<string | null>(null);
const rentalDateError = ref<string | null>(null);
const deliveryDateError = ref<string | null>(null);

const formError = ref<string | null>(null);
const formSuccess = ref<string | null>(null);
const clientActiveRentalError = ref<string | null>(null);

// Dados para seleção de cliente
const availableClients = computed(() => clientStore.allClients.filter(c => c.status === 'active'));

// Dados para seleção de filme
const searchMovieTitle = ref('');
const searchMovieYear = ref('');
const selectedMovies = ref<MovieSearchResult[]>([]);

// Verifica se um filme já está selecionado na lista
const isMovieSelected = (imdbID: string) => {
    return selectedMovies.value.some(movie => movie.imdbID === imdbID);
};

// Lógica de busca de filmes para seleção
const handleMovieSearch = () => {
    movieStore.fetchMovies(searchMovieTitle.value, searchMovieYear.value);
};

// Adiciona um filme à locação
const addMovieToRental = (movie: MovieSearchResult) => {
    if (!isMovieSelected(movie.imdbID)) {
        selectedMovies.value.push(movie);
        formData.value.movieIds.push(movie.imdbID);
        movieIdsError.value = null;
    }
};

// Remove um filme da locação
const removeMovieFromRental = (imdbID: string) => {
    selectedMovies.value = selectedMovies.value.filter(movie => movie.imdbID !== imdbID);
    formData.value.movieIds = formData.value.movieIds.filter(id => id !== imdbID);
};

// Lógica de pré-preenchimento para edição (se for implementada)
onMounted(() => {
    // Para edição: carregar dados da locação
    if (props.id) { // Se um ID for passado como prop, estamos em modo de edição
        const rentalToEdit = rentalStore.getRentalById(props.id);
        if (rentalToEdit) {
            // Se for modo de edição, preenche formData.
            // Para movieIds, precisamos popular selectedMovies com os MovieSearchResult correspondentes.
            // Para o desafio, vamos assumir que apenas a listagem/criação é essencial,
            // ou simplificar a exibição dos filmes selecionados.
            // Aqui, apenas carregamos os IDs.
            // Se precisar exibir os detalhes dos filmes na edição, terá que fazer uma busca para cada imdbID.
            formData.value = {
                clientId: rentalToEdit.clientId,
                movieIds: rentalToEdit.movieIds,
                rentalDate: rentalToEdit.rentalDate,
                deliveryDate: rentalToEdit.deliveryDate,
            };
        } else {
            formError.value = 'Locação não encontrada para edição.';
            setTimeout(() => router.push({ name: 'Rentals' }), 2000);
        }
    }
});


const handleSubmit = async () => {
    clearErrors();
    clientActiveRentalError.value = null;

    let hasFieldErrors = false;
    if (!formData.value.clientId) { clientIdError.value = 'Selecione um cliente.'; hasFieldErrors = true; }
    if (!formData.value.movieIds || formData.value.movieIds.length === 0) { movieIdsError.value = 'Selecione pelo menos um filme.'; hasFieldErrors = true; }
    if (!formData.value.rentalDate) { rentalDateError.value = 'Data de locação é obrigatória.'; hasFieldErrors = true; }
    if (!formData.value.deliveryDate) { deliveryDateError.value = 'Data de entrega é obrigatória.'; hasFieldErrors = true; }

    // Validação de datas: data de entrega não pode ser anterior à data de locação
    if (formData.value.rentalDate && formData.value.deliveryDate &&
        new Date(formData.value.deliveryDate) < new Date(formData.value.rentalDate)) {
        deliveryDateError.value = 'Data de entrega não pode ser anterior à data de locação.';
        hasFieldErrors = true;
    }

    if (hasFieldErrors) {
        formError.value = 'Por favor, preencha todos os campos obrigatórios corretamente.';
        return;
    }

    try {
        await rentalStore.addRental({
            clientId: formData.value.clientId,
            movieIds: formData.value.movieIds,
            rentalDate: formData.value.rentalDate,
            deliveryDate: formData.value.deliveryDate,
        });

        formSuccess.value = 'Locação registrada com sucesso!';
        console.log('Locação registrada com sucesso!');

        // Limpar formulário após cadastro bem-sucedido
        formData.value = {
            clientId: '',
            movieIds: [],
            rentalDate: new Date().toISOString().slice(0, 10),
            deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10),
        };
        selectedMovies.value = [];
        searchMovieTitle.value = '';
        searchMovieYear.value = '';

        setTimeout(() => {
            router.push({ name: 'Rentals' });
        }, 1500);

    } catch (e: any) {
        formError.value = e.message || 'Ocorreu um erro ao registrar a locação.';
        if (e.message.includes("já possui uma locação ativa")) {
            clientActiveRentalError.value = e.message;
        }
        console.error("Erro no handleSubmit da locação:", e);
    }
};

// Funções para edição/inicialização (simplificadas para o desafio)
const isEditMode = computed(() => !!props.id); // Usado para mudar título e lógica de submissão

// Função para limpar erros
const clearErrors = () => {
    clientIdError.value = null;
    movieIdsError.value = null;
    rentalDateError.value = null;
    deliveryDateError.value = null;
    formError.value = null;
    formSuccess.value = null;
    clientActiveRentalError.value = null;
};
</script>

<style scoped>
/* Adicione estilos específicos aqui */
</style>