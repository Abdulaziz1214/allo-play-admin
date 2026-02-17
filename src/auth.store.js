import { create } from "zustand";
import { authApi } from "./services/auth/auth.api";
import { tokenStorage } from "./services/http/tokenStorage";

const pickAdmin = (res) => res?.data?.admin || null;
const pickTokens = (res) => res?.data?.tokens || null;

export const useAuthStore = create((set, get) => ({
  admin: null,
  roles: [],
  permissions: [],
  isAuthReady: false,
  isLoading: false,
  error: null,

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

      const { data } = await authApi.me();
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

      set({
        admin,
        roles: admin.roles || [],
        permissions: admin.permissions || [],
        isLoading: false,
      });
      return true;
    } catch (e) {
      set({
        error: e?.response?.data?.message || e?.message || "Login failed",
        isLoading: false,
      });
      return false;
    }
  },

  async logout() {
    try {
      await authApi.logout();
    } catch (_) {
      // ignore - we clear locally regardless
    } finally {
      tokenStorage.clear();
      set({ admin: null, roles: [], permissions: [] });
    }
  },
}));
