import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const api = axios.create({
<<<<<<< HEAD
  baseURL: 'http://172.20.32.1:3000'
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
=======
  baseURL: "http://192.168.11.143:3000",
});

api.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('token'); 
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
>>>>>>> ccb4d475e7941fb74cf40480efd9a6b8bfba3c2d
