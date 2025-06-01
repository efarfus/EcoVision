import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import BoxFavs from "../../components/BoxFavs";
import Toolbar from "../../components/Toolbar";
import { router } from "expo-router";
import { getFavs } from "../../services/get/getFavs";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Fav {
  id: string;
  description: string;
  uri: string;
  latitude: number;
  longitude: number;
}

export default function Favs() {
  const [favs, setFavs] = useState<Fav[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const favsData = [
    {
      id: "1",
      description: "Salvo em 21/04/2025",
      uri: "",
      latitude: -21.513514512,
      longitude: -51.2375464857,
    },
    {
      id: "2",
      description: "Salvo em 22/04/2025",
      uri: "",
      latitude: -21.54514512,
      longitude: -51.2351544857,
    },
    {
      id: "3",
      description: "Salvo em 23/04/2025",
      uri: "",
      latitude: -21.5165514512,
      longitude: -51.23514857,
    },
  ];

  const fetchData = async () => {
    try {
      const response = await getFavs();
      setFavs(response);
      console.log("Dados de favoritos:", response);
    } catch (error) {
      console.error("Erro ao buscar favoritos:", error);
    }
  };

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
        data={favsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BoxFavs
            description={item.description}
            uri={item.uri}
            latitude={item.latitude}
            longitude={item.longitude}
            onPress={() => {
              AsyncStorage.setItem("favId", item.id);
              router.push("/screens/favsDetails");
            }}
          />
        )}
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
