import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Toolbar from "../../components/Toolbar";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFavsById } from "../../services/get/getFavsById";

export default function FavsDetails(
  createdAt: string,
  latitude: number,
  longitude: number,
  uri: string
) {
  const [idFav, setIdFav] = useState("");
  const [favsDetails, setFavsDetails] = useState({
    createdAt: "",
    latitude: 0,
    longitude: 0,
    uri: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const fetchData = async () => {
    try {
      const asyncIdFav = await AsyncStorage.getItem("idFav");
      setIdFav(asyncIdFav || "");

      const response = await getFavsById(idFav);

      if (response) {
        setFavsDetails({
          createdAt: response.createdAt,
          latitude: response.latitude,
          longitude: response.longitude,
          uri: response.uri,
        });
      } else {
        console.error("No data found for the given ID.");
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Toolbar title="Detalhes" onPress={handleGoBack} />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.detailText}>
          Coordenadas da imagem: {latitude + ", " + longitude}
        </Text>
        <Text style={styles.detailText}>Favoritado em: {createdAt}</Text>
        <Text style={styles.detailText}>
          Descrição: Uma descrição mais longa sobre este item...
        </Text>
        <Image
          source={{
            uri: uri,
          }}
          style={styles.detailImage}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 15,
    marginBottom: 15,
  },
  placeholderContent: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});
