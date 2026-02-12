import { httpClient } from "../http/httpClient";

export const seriesApi = {
  // GET /api/v1/series
  list(params) {
    return httpClient.get("/api/v1/series", { params });
  },

  // GET /api/v1/series/search
  search(params) {
    return httpClient.get("/api/v1/series/search", { params });
  },

  // GET /api/v1/series/popular
  popular(params) {
    return httpClient.get("/api/v1/series/popular", { params });
  },

  // GET /api/v1/series/latest
  latest(params) {
    return httpClient.get("/api/v1/series/latest", { params });
  },

  // GET /api/v1/series/by-genre/{genre_id}
  byGenre(genreId, params) {
    return httpClient.get(`/api/v1/series/by-genre/${genreId}`, { params });
  },

  // GET /api/v1/series/by-country/{country_id}
  byCountry(countryId, params) {
    return httpClient.get(`/api/v1/series/by-country/${countryId}`, { params });
  },

  // GET /api/v1/series/{series_id}
  getById(seriesId) {
    return httpClient.get(`/api/v1/series/${seriesId}`);
  },

  // GET /api/v1/series/{series_id}/seasons
  getSeasons(seriesId) {
    return httpClient.get(`/api/v1/series/${seriesId}/seasons`);
  },

  // GET /api/v1/series/seasons/{season_id}
  getSeasonById(seasonId) {
    return httpClient.get(`/api/v1/series/seasons/${seasonId}`);
  },

  // GET /api/v1/series/seasons/{season_id}/episodes
  getEpisodes(seasonId, params) {
    return httpClient.get(`/api/v1/series/seasons/${seasonId}/episodes`, { params });
  },

  // GET /api/v1/series/episodes/{episode_id}
  getEpisodeById(episodeId) {
    return httpClient.get(`/api/v1/series/episodes/${episodeId}`);
  },
};