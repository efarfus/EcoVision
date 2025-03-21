import { api } from "../../api";

export const getUserById = async (userId: string) => {
    try {
      const response = await api.get(`/user/token`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      throw error;
    }
  };