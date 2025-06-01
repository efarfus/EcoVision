import { api } from "../../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type PostFavsData = {
  latitude: number;
  longitude: number;
  uri: string;
  userId?: string;
};

const getUserId = async () => {
  try {
    const userId = await AsyncStorage.getItem("userId");
    if (userId) {
      return userId;
    } else {
      throw new Error("User ID not found in storage");
    }
  } catch (error) {
    console.error("Error retrieving user ID:", error);
    throw error;
  }
};

export const postFavs = async ({
  latitude,
  longitude,
  uri,
}: PostFavsData) => {
  try {
    const response = await api.post(`/addFavorite`, {
      latitude,
      longitude,
      uri,
      getUserId
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao postar fav:", error);
    throw error;
  }
};
