import { api } from "../../api";

export const getFavs = async (userId: string) => {
  try {
    console.log("Buscando favoritos para o usuário:", userId);
    const response = await api.get(`/getAllCoordinates`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
