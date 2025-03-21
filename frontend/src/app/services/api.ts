import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
  baseURL: 'http://172.20.32.1:3000'
})


api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token'); 
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});