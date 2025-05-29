import { api } from "../../api";

export const getFavsById = async (id: string) => {
  try {
    const response = await api.get(`getCoordinate/${id}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
