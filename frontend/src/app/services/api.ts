import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  // Rotear com o celular e ver o ipv4 e adicionar abaixo
  baseURL: "http://192.168.245.201:3000",
});

api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token'); 
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
