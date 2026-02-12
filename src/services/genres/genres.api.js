import { httpClient } from "../http/httpClient";

export const genresApi = {
  list() {
    return httpClient.get("/api/v1/admin/genres");
  },
  create(payload) {
    // payload пример: { name: "Action" } или { title: "Action" }
    return httpClient.post("/api/v1/admin/genres", payload);
  },
};
