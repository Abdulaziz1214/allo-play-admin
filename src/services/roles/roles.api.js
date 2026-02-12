import { httpClient } from "../http/httpClient";

export const rolesApi = {
  // GET /api/v1/admin/roles
  list() {
    return httpClient.get("/api/v1/admin/roles");
  },

  // POST /api/v1/admin/roles
  create(payload) {
    return httpClient.post("/api/v1/admin/roles", payload);
  },

  // GET /api/v1/admin/roles/{role_id}
  getById(roleId) {
    return httpClient.get(`/api/v1/admin/roles/${roleId}`);
  },

  // PUT /api/v1/admin/roles/{role_id}
  update(roleId, payload) {
    return httpClient.put(`/api/v1/admin/roles/${roleId}`, payload);
  },

  // DELETE /api/v1/admin/roles/{role_id}
  delete(roleId) {
    return httpClient.delete(`/api/v1/admin/roles/${roleId}`);
  },

  // GET /api/v1/admin/roles/{role_id}/permissions
  getPermissions(roleId) {
    return httpClient.get(`/api/v1/admin/roles/${roleId}/permissions`);
  },

  // PUT /api/v1/admin/roles/{role_id}/permissions
  updatePermissions(roleId, payload) {
    return httpClient.put(`/api/v1/admin/roles/${roleId}/permissions`, payload);
  },
};
