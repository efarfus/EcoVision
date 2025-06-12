import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  //Rotear com celular, entrar na rede, e conectar com o ipv4 de refe WIFI
  // baseURL: "http://192.168.176.201:3000",
  baseURL:"http://192.168.4.3:3000"
  // baseURL: "http://172.25.96.1:3000",
});

api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
