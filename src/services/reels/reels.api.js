import { httpClient } from "../http/httpClient";

export const reelsApi = {
  // GET /api/v1/admin/reels
  list() {
    return httpClient.get("/api/v1/admin/reels");
  },

  // POST /api/v1/admin/reels
  create(payload) {
    return httpClient.post("/api/v1/admin/reels", payload);
  },

  // GET /api/v1/admin/reels/{reel_id}
  getById(reelId) {
    return httpClient.get(`/api/v1/admin/reels/${reelId}`);
  },

  // PUT /api/v1/admin/reels/{reel_id}
  update(reelId, payload) {
    return httpClient.put(`/api/v1/admin/reels/${reelId}`, payload);
  },

  // DELETE /api/v1/admin/reels/{reel_id}
  delete(reelId) {
    return httpClient.delete(`/api/v1/admin/reels/${reelId}`);
  },

  // POST /api/v1/admin/reels/{reel_id}/link-movie
  linkMovie(reelId, payload) {
    return httpClient.post(`/api/v1/admin/reels/${reelId}/link-movie`, payload);
  },

  // DELETE /api/v1/admin/reels/{reel_id}/unlink-movie/{movie_id}
  unlinkMovie(reelId, movieId) {
    return httpClient.delete(`/api/v1/admin/reels/${reelId}/unlink-movie/${movieId}`);
  },

  // POST /api/v1/admin/reels/{reel_id}/link-episode
  linkEpisode(reelId, payload) {
    return httpClient.post(`/api/v1/admin/reels/${reelId}/link-episode`, payload);
  },

  // DELETE /api/v1/admin/reels/{reel_id}/unlink-episode/{episode_id}
  unlinkEpisode(reelId, episodeId) {
    return httpClient.delete(`/api/v1/admin/reels/${reelId}/unlink-episode/${episodeId}`);
  },
};