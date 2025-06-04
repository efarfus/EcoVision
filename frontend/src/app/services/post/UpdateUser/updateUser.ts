import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api";

export const updateUser = async (
  email: string,
  username: string,
  password: string,
  userId: string | null
) => {
  try {

    const response = await api.put(
      "/user/update",
      {
        email,
        name: username,
        password,
        userId
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};
