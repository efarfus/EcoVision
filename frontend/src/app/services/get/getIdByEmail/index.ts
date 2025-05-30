import { api } from "../../api";



export const getIdByEmail = async (email: string) => {
  try {
    const response = await api.get(`/user/email`, {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar ID:", error);
    throw error;
  }
};
