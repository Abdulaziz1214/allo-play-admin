const ACCESS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMmVlYTMzNi1kNDQwLTRiMjUtODA1Ni04MzU4M2NjMGZkMTQiLCJ1c2VybmFtZSI6ImpvbmthIiwidG9rZW5fdHlwZSI6ImFkbWluX2FjY2VzcyIsImlhdCI6MTc2OTcwNjIyMywiZXhwIjoxNzY5NzA3MTIzfQ.3R74GYe6TIaPcOvIhDmEbJVc5MjfyWyO1W8Kpc84DwQ";
const REFRESH_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMmVlYTMzNi1kNDQwLTRiMjUtODA1Ni04MzU4M2NjMGZkMTQiLCJ0b2tlbl90eXBlIjoiYWRtaW5fcmVmcmVzaCIsImlhdCI6MTc2OTcwNjIyMywiZXhwIjoxNzcwMzExMDIzfQ.-xK_wLJ3mVI3CxmpizxT4GmhNU2F6AKKGm0OeD0kS-w";

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
