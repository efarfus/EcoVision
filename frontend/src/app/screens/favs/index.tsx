import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, RefreshControl } from "react-native"; // Importe RefreshControl
import BoxFavs from "../../components/BoxFavs";
import Toolbar from "../../components/Toolbar";
import { router, useFocusEffect } from "expo-router";
import { getFavs } from "../../services/get/getFavs";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
