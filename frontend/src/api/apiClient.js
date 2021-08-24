import axios from "axios";
import { API_URI } from "config";

const apiClient = axios.create({
  baseURL: API_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAuthToken = () => {
  return localStorage.getItem("token");
};

const authInterceptor = (config) => {
  config.headers["Authorization"] = "Bearer " + getAuthToken();
  return config;
};

const unauthenticatedError = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userData");
  window.location.reload();
};

const errorInterceptor = (error) => {
  switch ((error.response || {}).status) {
    case 401:
      return unauthenticatedError();
    default:
      return Promise.reject(error);
  }
};

const responseInterceptor = (response) => response;

apiClient.interceptors.request.use(authInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export default apiClient;

export const refreshClient = axios.create({
  baseURL: API_URI,
  headers: {
    "Content-Type": "application/json",
  },
});

refreshClient.interceptors.request.use(authInterceptor);

