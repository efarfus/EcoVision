import { api } from "../../api";

type PostLoginData = {
  email: string;
  password: string;
};

export const postLogin = async ({ email, password }: PostLoginData) => {
  try {
    const response = await api.post(`/login`, {
      email,
      password,
    });

    await sessionStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw error;
  }
};
