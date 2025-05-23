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


    await AsyncStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
};
