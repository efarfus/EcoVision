import { api } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PostFavsData = {
  latitude: number;
  longitude: number;
  uri: string;
  createdAt: string;
};

export const postFavs = async ({
  latitude,
  longitude,
  createdAt,
  uri,
}: PostFavsData) => {
  try {
    const response = await api.post(`/addFavorite`, {
      latitude,
      longitude,
      createdAt,
      uri,
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao postar fav:", error);
    throw error;
  }
};
