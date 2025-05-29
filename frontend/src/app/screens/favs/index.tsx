import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import BoxFavs from "../../components/BoxFavs";
import Toolbar from "../../components/Toolbar";
import { router } from "expo-router";

export default function Favs() {
  const [favs, setFavs] = useState([]);

  return (
    <View style={styles.container}>
      <Toolbar
        title="Favoritos"
        onPress={() => {
          router.back();
        }}
      />

      {/* fazer uma flatlist com os favs */}

      <BoxFavs
        description="Salvo em 21/04/2025"
        imageUrl=""
        title="-21.51514512, -51.234857"
        onPress={() => {
          router.push("/screens/favsDetails");
        }}
      />
      <BoxFavs
        description="Salvo em 21/04/2025"
        imageUrl=""
        title="-21.51514512, -51.234857"
        onPress={() => {
          router.push("/screens/favsDetails");
        }}
      />
      <BoxFavs
        description="Salvo em 21/04/2025"
        imageUrl=""
        title="-21.51514512, -51.234857"
        onPress={() => {
          router.push("/screens/favsDetails");
        }}
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
