import { authApi } from "../auth/auth.api";
import { tokenStorage } from "./tokenStorage";

// чтобы параллельные 401 не делали 10 refresh запросов
let refreshPromise = null;

export async function getFreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refresh = tokenStorage.getRefresh();
      if (!refresh) throw new Error("No refresh token");

      const { data } = await authApi.refresh({ refresh_token: refresh });

      // ожидаем формат как в login: data.data.tokens.access_token
      const tokens = data?.data?.tokens;
      const newAccess = tokens?.access_token;
      const newRefresh = tokens?.refresh_token;

      if (!newAccess) throw new Error("No access token in refresh response");

      tokenStorage.setAccess(newAccess);
      if (newRefresh) tokenStorage.setRefresh(newRefresh);

      return newAccess;
    })().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}
