import { api } from "../../api";

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

    await sessionStorage.setItem("token", response.data.token);

    return response.data;
  } catch (error: any) {
    console.error("Erro ao registrar:", error);
    throw error;
  }
};
