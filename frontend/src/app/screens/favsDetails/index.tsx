import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Toolbar from "../../components/Toolbar";
// Se você tiver um hook de navegação (ex: React Navigation), você o importaria aqui
// import { useNavigation } from '@react-navigation/native';

// Props esperadas para esta tela, por exemplo, o ID do favorito
interface FavsDetailsProps {
  // route?: { params?: { favoriteId?: string } }; // Exemplo se usando React Navigation
}

export default function FavsDetails({}: /* route */ FavsDetailsProps) {
  // const navigation = useNavigation(); // Para navegação programática
  // const favoriteId = route?.params?.favoriteId; // Exemplo de como pegar um ID

  const handleGoBack = () => {
    // navigation.goBack(); // Exemplo de navegação para voltar
    console.log("Botão de voltar pressionado"); // Placeholder se não houver navegação real
  };

  return (
    <View style={styles.container}>
      <Toolbar title="Detalhes" onPress={handleGoBack} />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.detailText}>ID do Favorito: {"N/A"}</Text>
        <Text style={styles.detailText}>Nome: Nome do Item Favorito</Text>
        <Text style={styles.detailText}>
          Descrição: Uma descrição mais longa sobre este item...
        </Text>
        <Image
          source={{
            uri: "https://placehold.co/200x200/cccccc/000000?text=Detalhe",
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
    backgroundColor: "#fff", // Um fundo um pouco diferente para a tela de detalhes
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
