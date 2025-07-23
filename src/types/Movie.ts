// src/types/Movie.ts
// Interface para um item de filme retornado na BUSCA (parâmetro 's')
export interface MovieSearchResult {
    Title: string;
    Year: string;
    imdbID: string; // ID único do filme
    Type: string; // "movie", "series", "episode"
    Poster: string;
}

// Interface para a resposta completa da BUSCA (parâmetro 's')
export interface OMDbSearchResponse {
    Search?: MovieSearchResult[]; // O array de resultados da busca
    totalResults?: string; // Número total de resultados
    Response: string; // "True" se a requisição foi bem-sucedida, "False" caso contrário
    Error?: string; // Mensagem de erro se Response for "False"
}

// Interface para um item de avaliação dentro dos detalhes completos
export interface Rating {
    Source: string;
    Value: string;
}

// Interface para os DETALHES COMPLETOS de um filme (parâmetro 'i')
export interface MovieDetails {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: Rating[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: string;
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response: string; // "True" ou "False"
    Error?: string; // Mensagem de erro
}