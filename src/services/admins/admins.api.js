import { httpClient } from "../http/httpClient";

export const adminsApi = {
  // GET /api/v1/admin/admins
  list() {
    return httpClient.get("/api/v1/admin/admins");
  },

  // POST /api/v1/admin/admins
  create(payload) {
    return httpClient.post("/api/v1/admin/admins", payload);
  },

  // GET /api/v1/admin/admins/{target_admin_id}
  getById(adminId) {
    return httpClient.get(`/api/v1/admin/admins/${adminId}`);
  },

  // PUT /api/v1/admin/admins/{target_admin_id}
  update(adminId, payload) {
    return httpClient.put(`/api/v1/admin/admins/${adminId}`, payload);
  },

  // DELETE /api/v1/admin/admins/{target_admin_id}
  delete(adminId) {
    return httpClient.delete(`/api/v1/admin/admins/${adminId}`);
  },

  // PUT /api/v1/admin/admins/{target_admin_id}/status
  updateStatus(adminId, payload) {
    return httpClient.put(`/api/v1/admin/admins/${adminId}/status`, payload);
  },

  // PUT /api/v1/admin/admins/{target_admin_id}/roles
  updateRoles(adminId, payload) {
    return httpClient.put(`/api/v1/admin/admins/${adminId}/roles`, payload);
  },

  // POST /api/v1/admin/admins/{target_admin_id}/reset-password
  resetPassword(adminId, payload) {
    return httpClient.post(`/api/v1/admin/admins/${adminId}/reset-password`, payload);
  },
};