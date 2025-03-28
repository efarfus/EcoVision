import { api } from "../../api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const postSignUp = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const response = await api.post("/signup", {
      email,
      password,
      name: username,
    });

    console.log('Enviou e recebeu response: ', response.data.token)

    await AsyncStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
};
