import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../api";

export const updateUser = async (
  email: string,
  username: string,
  password: string
) => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      throw new Error("Token não encontrado. Usuário não autenticado.");
    }

    const response = await api.put(
      "/user/update",
      {
        email,
        name: username,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar perfil:", error);
    throw error;
  }
};
