import { httpClient } from "../http/httpClient";

export const tvChannelsApi = {
  // GET /api/v1/tv/categories
  getCategories() {
    return httpClient.get("/api/v1/tv/categories");
  },

  // GET /api/v1/tv/channels
  list(params) {
    return httpClient.get("/api/v1/tv/channels", { params });
  },

  // GET /api/v1/tv/channels/{channel_id}
  getById(channelId) {
    return httpClient.get(`/api/v1/tv/channels/${channelId}`);
  },

  // GET /api/v1/tv/channels/{channel_id}/epg
  getEpg(channelId, params) {
    return httpClient.get(`/api/v1/tv/channels/${channelId}/epg`, { params });
  },

  // GET /api/v1/tv/channels/{channel_id}/epg/current
  getCurrentEpg(channelId) {
    return httpClient.get(`/api/v1/tv/channels/${channelId}/epg/current`);
  },

  // GET /api/v1/tv/channels/{channel_id}/epg/upcoming
  getUpcomingEpg(channelId) {
    return httpClient.get(`/api/v1/tv/channels/${channelId}/epg/upcoming`);
  },
};