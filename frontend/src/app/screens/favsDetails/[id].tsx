import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import Toolbar from "../../components/Toolbar";
import { router, useLocalSearchParams } from "expo-router";
import { getFavsById } from "../../services/get/getFavsById";

interface FavoriteDetails {
  createdAt: string;
  latitude: number;
  longitude: number;
  uri: string;
}
const YEARS = [2000, 2005, 2010, 2015, 2020];

export default function FavsDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favsDetails, setFavsDetails] = useState<FavoriteDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [mainBinaryImage, setMainBinaryImage] = useState(
    "Carregando dados binários..."
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [comparisonImage, setComparisonImage] = useState<{
    uri: string;
    binary: string;
  } | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        try {
          const response = await getFavsById(id);
          if (response && response.coordinates) {
            setFavsDetails(response.coordinates);
            setMainBinaryImage("dados da imagem de satélite principal");
          } else {
            console.error("Nenhum dado encontrado para o ID:", id);
          }
        } catch (error) {
          console.error("Erro ao buscar detalhes:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  const handleYearSelect = async (year: number) => {
    if (selectedYear === year) return;

    setSelectedYear(year);
    setIsComparisonLoading(true);
    setComparisonImage(null);

    console.log(`Simulando busca para o ano ${year}...`);
    setTimeout(() => {
      setComparisonImage({
        uri: `https://picsum.photos/400/300?random=${year}`,
        binary: `Imagem binária para o ano ${year}`,
      });
      setIsComparisonLoading(false);
    }, 1500);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!favsDetails) {
    return (
      <View style={styles.container}>
        <Toolbar title="Erro" onPress={handleGoBack} />
        <View style={styles.centered}>
          <Text>Não foi possível carregar os detalhes.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toolbar title="Detalhes" onPress={handleGoBack} />
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.detailText}>
          Coordenadas da imagem: {favsDetails.latitude}, {favsDetails.longitude}
        </Text>
        <Text style={styles.detailText}>
          Favoritado em:{" "}
          {new Date(favsDetails.createdAt).toLocaleDateString("pt-BR")}
        </Text>
        <Image source={{ uri: favsDetails.uri }} style={styles.detailImage} />

        <Text style={styles.sectionTitle}>
          Imagem Binária da Foto de Satélite
        </Text>
        <View style={styles.binaryContainer}>
          <Text style={styles.binaryText} selectable>
            {mainBinaryImage}
          </Text>
          <Image source={{ uri: favsDetails.uri }} style={styles.detailImage} />
        </View>

        <Text style={styles.sectionTitle}>
          Selecione um ano para comparação
        </Text>
        <View style={styles.yearSelectionContainer}>
          {YEARS.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearButton,
                selectedYear === year && styles.selectedYearButton,
              ]}
              onPress={() => handleYearSelect(year)}
            >
              <Text
                style={[
                  styles.yearButtonText,
                  selectedYear === year && styles.selectedYearButtonText,
                ]}
              >
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedYear && (
          <View style={styles.comparisonSection}>
            {isComparisonLoading ? (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={{ marginVertical: 50 }}
              />
            ) : (
              comparisonImage && (
                <>
                  <Image
                    source={{ uri: comparisonImage.uri }}
                    style={styles.detailImage}
                  />
                  <Text style={styles.sectionTitle}>
                    Imagem Binária de {selectedYear}
                  </Text>
                  <View style={styles.binaryContainer}>
                    <Text style={styles.binaryText} selectable>
                      {comparisonImage.binary}
                    </Text>
                    <Image
                      source={{ uri: comparisonImage.uri }}
                      style={styles.detailImage}
                    ></Image>
                  </View>
                </>
              )
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
  detailImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
    color: "#333",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  binaryContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    minHeight: 80,
    justifyContent: "center",
  },
  binaryText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#555",
  },
  yearSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 5,
  },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#e9e9e9",
    borderRadius: 20,
    marginVertical: 5,
  },
  selectedYearButton: {
    backgroundColor: "#007AFF",
  },
  yearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  selectedYearButtonText: {
    color: "#fff",
  },
  comparisonSection: {
    marginTop: 20,
  },
});
