import axios from 'axios';
import keycloak from "../auth/keycloak";

const http = axios.create({
  baseURL: window._env_.BASE_URL,
});

http.interceptors.request.use(
  async (config) => {
    if (keycloak?.token) {
      try {
        await keycloak.updateToken(5);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch (error) {
        console.error("Token refresh failed", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default http;
