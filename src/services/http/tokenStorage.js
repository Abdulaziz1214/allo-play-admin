const ACCESS_KEY = "admin_access_token";
const REFRESH_KEY = "admin_refresh_token";

export const tokenStorage = {
  getAccess() {
    return localStorage.getItem(ACCESS_KEY);
  },
  setAccess(token) {
    if (token) localStorage.setItem(ACCESS_KEY, token);
  },
  getRefresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  setRefresh(token) {
    if (token) localStorage.setItem(REFRESH_KEY, token);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};
