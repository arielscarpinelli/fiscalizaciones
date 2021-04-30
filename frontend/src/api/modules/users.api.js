import apiClient from "api/apiClient";

export const login = (data) => apiClient.post("auth/login", data);
export const forgotPassword = (data) => apiClient.post("auth/forgot-password", data);
export const resetPassword = (data) => apiClient.post("auth/reset-password", data);


export const checkToken = () => apiClient.post("users/check-token-validity");

export const getUsers = () => apiClient.get("users");
export const postUser = (data) => apiClient.post(`users`, data);
export const getUser = (id) => apiClient.get(`users/${id}`);
export const deleteUser = (id) => apiClient.delete(`users/${id}`);