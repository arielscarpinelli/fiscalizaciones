import apiClient from "api/apiClient";

export const login = (data) => apiClient.post("auth/fiscal/login", data);

export const validateEmail = (data) =>
  apiClient.post("auth/fiscal/validate-email", data);
