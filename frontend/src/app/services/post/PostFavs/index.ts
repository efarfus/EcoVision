import { api } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PostFavsData = {
  latitude: number;
  longitude: number;
  uri: string;
  userId?: string;
};



export const postFavs = async ({
  latitude,
  longitude,
  uri,
  userId
}: PostFavsData) => {
  try {
    const response = await api.post(`/addFavorite`, {
      latitude,
      longitude,
      uri,
      userId
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao postar fav:", error);
    throw error;
  }
};
