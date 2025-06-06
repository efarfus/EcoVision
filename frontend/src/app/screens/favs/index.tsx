import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, RefreshControl, Alert } from "react-native"; // Importe RefreshControl
import BoxFavs from "../../components/BoxFavs";
import Toolbar from "../../components/Toolbar";
import { router, useFocusEffect } from "expo-router";
import { getFavs } from "../../services/get/getFavs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteFavoriteCoordinate } from "../../services/delete/deleteFav";

interface Fav {
  id: string;
  createdAt: string;
  uri: string;
  latitude: number;
  longitude: number;
}

export default function Favs() {
  const [favs, setFavs] = useState<Fav[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleDelete = async (favId: string) => {
  // 1. Pedir confirmação ao usuário
  Alert.alert(
    "Confirmar Exclusão",
    "Você tem certeza que deseja remover este local dos seus favoritos?",
    [
      {
        text: "Cancelar",
        style: "cancel"
      },
      {
        text: "Sim, Excluir",
        onPress: async () => {
          try {
            await deleteFavoriteCoordinate(favId);
            setFavs(currentFavorites =>
              currentFavorites.filter(fav => fav.id !== favId)
            );

            Alert.alert("Sucesso", "Favorito removido!");

          } catch (error) {
            Alert.alert("Erro", "Não foi possível remover o favorito. Tente novamente.");
          }
        },
        style: "destructive"
      }
    ]
  );
};

  const fetchData = useCallback(async (id: string) => {
    try {
      const response = await getFavs(id);
      setFavs(response.coordinates);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
      setFavs([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadUserIdAndFetchData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem("userId");
          if (isActive && storedUserId) {
            fetchData(storedUserId);
          } else if (isActive) {
            console.warn(
              "User ID not found in storage. Cannot fetch favorites."
            );
            setFavs([]);
          }
        } catch (error) {
          if (isActive) {
            console.error(
              "Error fetching userId from storage on focus:",
              error
            );
            setFavs([]);
          }
        }
      };

      loadUserIdAndFetchData();

      return () => {
        isActive = false;
      };
    }, [fetchData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        await fetchData(storedUserId);
      } else {
        console.warn("User ID not found for refresh.");
        setFavs([]);
      }
    } catch (error) {
      console.error("Erro ao atualizar favoritos:", error);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <Toolbar
        title="Favoritos"
        onPress={() => {
          router.back();
        }}
      />

      <FlatList
        style={{ width: "100%", marginLeft: 35 }}
        data={favs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BoxFavs
            description={item.createdAt}
            uri={item.uri}
            latitude={item.latitude}
            longitude={item.longitude}
            onPress={() => {
              AsyncStorage.setItem("favId", item.id);
              router.push(`/screens/favsDetails/${item.id}`);
            }}
            onDeletePress={() => handleDelete(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#17950E"]}
            tintColor={"#17950E"}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
