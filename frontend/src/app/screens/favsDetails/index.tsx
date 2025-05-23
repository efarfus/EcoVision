import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Toolbar from "../../components/Toolbar";
import { router } from "expo-router";

export default function FavsDetails(
  date: string,
  title: string,
  imageUrl: string
) {
  const handleGoBack = () => {
    router.back();
  };

  

  return (
    <View style={styles.container}>
      <Toolbar title="Detalhes" onPress={handleGoBack} />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.detailText}>Coordenadas da imagem: {title}</Text>
        <Text style={styles.detailText}>Favoritado em: {date}</Text>
        <Text style={styles.detailText}>
          Descrição: Uma descrição mais longa sobre este item...
        </Text>
        <Image
          source={{
            uri: imageUrl,
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
