import apiClient from "api/apiClient";

export const getProvinces = (config = {}) => apiClient.get("/geo/provinces", config);
export const getLocationsFromProvince = (province_id) =>
  apiClient.get(`/geo/provinces/${province_id}/locations`);
