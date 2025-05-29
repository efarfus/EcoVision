import { api } from "../../api";

export const getFavs = async () => {
  try {
    const response = await api.get(`/getAllCoordinates`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
