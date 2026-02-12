import { httpClient } from "../http/httpClient";

export const moviesApi = {
  // GET /api/v1/movies
  list(params) {
    return httpClient.get("/api/v1/movies", { params });
  },

  // GET /api/v1/movies/search
  search(params) {
    return httpClient.get("/api/v1/movies/search", { params });
  },

  // GET /api/v1/movies/popular
  popular(params) {
    return httpClient.get("/api/v1/movies/popular", { params });
  },

  // GET /api/v1/movies/latest
  latest(params) {
    return httpClient.get("/api/v1/movies/latest", { params });
  },

  // GET /api/v1/movies/by-genre/{genre_id}
  byGenre(genreId, params) {
    return httpClient.get(`/api/v1/movies/by-genre/${genreId}`, { params });
  },

  // GET /api/v1/movies/by-country/{country_id}
  byCountry(countryId, params) {
    return httpClient.get(`/api/v1/movies/by-country/${countryId}`, { params });
  },

  // GET /api/v1/movies/{movie_id}
  getById(movieId) {
    return httpClient.get(`/api/v1/movies/${movieId}`);
  },

  // GET /api/v1/movies/genres
  getGenres() {
    return httpClient.get("/api/v1/movies/genres");
  },
};