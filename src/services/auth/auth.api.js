import { httpClient } from "../http/httpClient";

export const authApi = {
    login(payload) {
    return httpClient.post("/api/v1/admin/auth/login", payload);
  },
  me() {
    return httpClient.get("/api/v1/admin/auth/me");
  },
  refresh(payload) {
    return httpClient.post("/api/v1/admin/auth/refresh", payload);
  },
  logout() {
    return httpClient.post("/api/v1/admin/auth/logout");
  },
};
