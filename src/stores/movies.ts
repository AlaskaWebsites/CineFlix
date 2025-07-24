// src/stores/movies.ts
import { defineStore } from 'pinia';
import { searchMovies } from '@/services/omdbService'; // Importe o serviço OMDb
import type { MovieSearchResult, OMDbSearchResponse } from '@/types/Movie'; // Importe os tipos necessários

interface MoviesState {
    movies: MovieSearchResult[]; // Array para armazenar os resultados da busca
    loading: boolean;          // Estado de carregamento da busca
    error: string | null;      // Mensagem de erro, se houver
    lastSearchTitle: string;   // Último título buscado (para persistir a busca)
    lastSearchYear: string;    // Último ano buscado
    currentPage: number;       // Página atual dos resultados
    totalResults: number;      // Total de resultados retornados pela OMDb
}

export const useMovieStore = defineStore('movie', {
    state: (): MoviesState => ({
        movies: [],
        loading: false,
        error: null,
        lastSearchTitle: '',
        lastSearchYear: '',
        currentPage: 1,
        totalResults: 0,
    }),
    getters: {
        getMovies: (state) => state.movies,
        isLoading: (state) => state.loading,
        getErrorMessage: (state) => state.error,
        // Verifica se há mais páginas para carregar (baseado no total de resultados da API)
        hasMorePages: (state) => {
            const itemsPerPage = 10; // A OMDb API retorna 10 itens por página por padrão
            return state.currentPage * itemsPerPage < state.totalResults;
        },
    },
    actions: {
        /**
         * Busca filmes na OMDb API.
         * @param title Título do filme a buscar.
         * @param year Ano de lançamento (opcional).
         * @param page Número da página para buscar (padrão 1).
         */
        async fetchMovies(title: string, year?: string, page: number = 1) {
            this.loading = true;
            this.error = null;

            try {
                const response: OMDbSearchResponse | null = await searchMovies(title, year, page);

                if (response && response.Response === 'True' && response.Search) {
                    this.movies = response.Search; // Atualiza a lista de filmes
                    this.totalResults = parseInt(response.totalResults || '0'); // Converte para número
                    this.currentPage = page;
                    this.lastSearchTitle = title;
                    this.lastSearchYear = year || ''; // Armazena o último ano buscado
                } else if (response && response.Response === 'False') {
                    this.movies = []; // Limpa filmes se a busca falhou
                    this.totalResults = 0;
                    this.error = response.Error || 'Nenhum filme encontrado para a sua busca.';
                } else {
                    this.movies = [];
                    this.totalResults = 0;
                    this.error = 'Ocorreu um erro ao buscar filmes. Tente novamente.';
                }
            } catch (e) {
                console.error("Erro na action fetchMovies:", e);
                this.movies = [];
                this.totalResults = 0;
                this.error = 'Falha na comunicação com a API. Verifique sua conexão.';
            } finally {
                this.loading = false;
            }
        },

        // Ação para carregar mais filmes (usada para paginação infinita ou botão "Carregar Mais")
        async loadMoreMovies() {
            if (!this.loading && this.hasMorePages && this.lastSearchTitle) {
                const nextPage = this.currentPage + 1;
                this.loading = true;
                this.error = null;
                try {
                    const response = await searchMovies(this.lastSearchTitle, this.lastSearchYear, nextPage);
                    if (response && response.Response === 'True' && response.Search) {
                        this.movies = [...this.movies, ...response.Search]; // Adiciona ao invés de substituir
                        this.currentPage = nextPage;
                    } else if (response && response.Response === 'False') {
                        this.error = response.Error || 'Não foi possível carregar mais filmes.';
                    }
                } catch (e) {
                    console.error("Erro na action loadMoreMovies:", e);
                    this.error = 'Falha ao carregar mais filmes.';
                } finally {
                    this.loading = false;
                }
            }
        },
    },
});