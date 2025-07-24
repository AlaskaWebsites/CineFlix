// src/services/omdbService.ts
import api from '@/services/api'; // <-- Importe a instância do Axios
import type { OMDbSearchResponse, MovieDetails } from '@/types/Movie';

const OMDB_API_KEY = 'bc982e18';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

interface SearchMovieParams {
    s: string;
    type: 'movie';
    apikey: string;
    page: number;
    y?: string;
}

interface GetMovieDetailsParams {
    i: string;
    apikey: string;
    plot?: 'short' | 'full';
}

export async function searchMovies(
    title: string,
    year?: string,
    page: number = 1
): Promise<OMDbSearchResponse | null> {
    try {
        if (!title) {
            console.warn("searchMovies: Título é obrigatório para a busca.");
            return null;
        }

        const params: SearchMovieParams = {
            s: title,
            type: 'movie',
            apikey: OMDB_API_KEY,
            page: page,
        };

        if (year) {
            params.y = year;
        }

        const response = await api.get<OMDbSearchResponse>(OMDB_BASE_URL, { params }); // <-- Use 'api.get'

        if (response.data.Response === 'False') {
            console.warn(`OMDb API - Erro na busca por filmes: ${response.data.Error}`);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Erro ao buscar filmes na OMDb API:", error);
        return null;
    }
}

export async function getMovieDetails(imdbID: string): Promise<MovieDetails | null> {
    try {
        if (!imdbID) {
            console.warn("getMovieDetails: IMDb ID é obrigatório.");
            return null;
        }

        const params: GetMovieDetailsParams = {
            i: imdbID,
            apikey: OMDB_API_KEY,
            plot: 'full',
        };

        const response = await api.get<MovieDetails>(OMDB_BASE_URL, { params }); // <-- Use 'api.get'

        if (response.data.Response === 'False') {
            console.warn(`OMDb API - Erro ao obter detalhes do filme: ${response.data.Error}`);
            return null;
        }

        return response.data;
    } catch (error) {
        console.error("Erro ao obter detalhes do filme na OMDb API:", error);
        return null;
    }
}