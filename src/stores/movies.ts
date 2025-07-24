// src/stores/movies.ts (confirme que este código está no seu arquivo)
import { defineStore } from 'pinia';
import { searchMovies } from '@/services/omdbService';
import type { MovieSearchResult, OMDbSearchResponse } from '@/types/Movie';

interface MoviesState {
    movies: MovieSearchResult[];
    loading: boolean;
    error: string | null;
    lastSearchTitle: string;
    lastSearchYear: string;
    currentPage: number;
    totalResults: number;
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
        hasMorePages: (state) => {
            const itemsPerPage = 10;
            return state.currentPage * itemsPerPage < state.totalResults;
        },
    },
    actions: {
        async fetchMovies(title: string, year?: string, page: number = 1) {
            this.loading = true;
            this.error = null;

            try {
                const response: OMDbSearchResponse | null = await searchMovies(title, year, page);

                if (response && response.Response === 'True' && response.Search) {
                    // FILTRAGEM PARA GARANTIR DADOS VÁLIDOS E EVITAR ERROS NO CONSOLE
                    this.movies = response.Search.filter(movie =>
                        movie.imdbID &&
                        movie.Poster && movie.Poster !== 'N/A' &&
                        movie.Type === 'movie'
                    );
                    this.totalResults = parseInt(response.totalResults || '0');
                    this.currentPage = page;
                    this.lastSearchTitle = title;
                    this.lastSearchYear = year || '';
                } else if (response && response.Response === 'False') {
                    this.movies = [];
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

        async loadMoreMovies() {
            if (!this.loading && this.hasMorePages && this.lastSearchTitle) {
                const nextPage = this.currentPage + 1;
                this.loading = true;
                this.error = null;
                try {
                    const response = await searchMovies(this.lastSearchTitle, this.lastSearchYear, nextPage);
                    if (response && response.Response === 'True' && response.Search) {
                        // FILTRAGEM PARA GARREGAR MAIS FILMES VÁLIDOS
                        const newMovies = response.Search.filter(movie =>
                            movie.imdbID &&
                            movie.Poster && movie.Poster !== 'N/A' &&
                            movie.Type === 'movie'
                        );
                        this.movies = [...this.movies, ...newMovies];
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