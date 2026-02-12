import { httpClient } from "../http/httpClient";

export const permissionsApi = {
  // GET /api/v1/admin/permissions
  list() {
    return httpClient.get("/api/v1/admin/permissions");
  },

  // GET /api/v1/admin/permissions/by-module
  byModule() {
    return httpClient.get("/api/v1/admin/permissions/by-module");
  },
};