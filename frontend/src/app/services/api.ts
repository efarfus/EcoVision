import axios from "axios";

export const api = axios.create({
  baseURL: "http://192.168.11.143:3000",
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
