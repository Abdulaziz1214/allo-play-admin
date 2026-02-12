import { create } from "zustand";
import { authApi } from "../src/services/auth/auth.api";
import { tokenStorage } from "./services/http/tokenStorage";

function extractFromLoginResponse(resData) {
  // Ваш формат:
  // { success, data: { admin, tokens: { access_token, refresh_token, ... } }, message }
  const admin = resData?.data?.admin || null;
  const access = resData?.data?.tokens?.access_token || null;
  const refresh = resData?.data?.tokens?.refresh_token || null;

  return { admin, access, refresh };
}

const pickAdmin = (res) => res?.data?.admin || null;
const pickTokens = (res) => res?.data?.tokens || null;

export const useAuthStore = create((set, get) => ({
  admin: null,
  isAuthReady: false,
  isLoading: false,
  isAuthReady: false,
  isLoading: false,
  error: null,

  // удобный флаг для ProtectedRoute
  isAuthenticated() {
    return !!get().admin;
  },

  hasPermission(perm) {
    return get().permissions.includes(perm);
  },


  async init() {
    try {
      const access = tokenStorage.getAccess();
      if (!access) {
        set({ isAuthReady: true });
        return;
      }

      // подтягиваем реального админа
      const { data } = await authApi.me();

      // предполагаем, что /me может вернуть либо {data:{admin}}, либо просто admin
      const admin = data?.data?.admin || data?.admin || data;
      const roles = admin?.roles || [];
      const permissions = admin?.permissions || [];

      set({ admin, roles, permissions, isAuthReady: true });
    } catch (e) {
      tokenStorage.clear();
      set({ admin: null, roles: [], permissions: [], isAuthReady: true });
    }
  },

  async login(credentials) {
    set({ isLoading: true, error: null });

    try {
      const { data } = await authApi.login(credentials);

      const admin = pickAdmin(data);
      const tokens = pickTokens(data);

      if (!admin || !tokens?.access_token || !tokens?.refresh_token) {
        throw new Error("Unexpected login response format");
      }

      tokenStorage.setAccess(tokens.access_token);
      tokenStorage.setRefresh(tokens.refresh_token);

      // У вас admin уже приходит в login-ответе — можно сразу ставить
      set({
        admin,
        roles: admin.roles || [],
        permissions: admin.permissions || [],
        isLoading: false,
      });
      return true;
    } catch (e) {
      set({
        error:
          e?.response?.data?.message ||
          e?.message ||
          "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

   // ---- logout ----
  async logout() {
    try {
      // опционально — если endpoint требует access token
      await authApi.logout();
    } catch (_) {
      // игнорируем — даже если сервер не ответил, мы локально выходим
    } finally {
      tokenStorage.clear();
      set({ admin: null, roles: [], permissions: [] });
    }
  },
}));