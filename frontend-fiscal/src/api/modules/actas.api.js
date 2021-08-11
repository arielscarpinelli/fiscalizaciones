import apiClient from "api/apiClient";

export const getActas = () => apiClient.get("actas/fiscal");
