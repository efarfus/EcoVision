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
import { postImage } from "../../servicesIA/post";
import getSentinelImagesByYear from "../../services/get/getSentinelImagesByYear";
import { Buffer } from "buffer";

interface FavoriteDetails {
  createdAt: string;
  latitude: number;
  longitude: number;
  uri: string;
}

const YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

export default function FavsDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [favsDetails, setFavsDetails] = useState<FavoriteDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const [mainMaskUri, setMainMaskUri] = useState<string | null>(null);
  const [mainMaskPercentage, setMainMaskPercentage] = useState<number | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [comparisonImage, setComparisonImage] = useState<{
    satelliteUri: string;
    maskUri: string;
    percentage: number;
  } | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchDataAndAnalyze = async () => {
        try {
          // 1. Busca os detalhes do favorito 
          const response = await getFavsById(id);
          if (response && response.coordinates) {
            const details = response.coordinates;
            setFavsDetails(details);

            // 2. Envia a imagem principal para a análise da IA
            const result = await postImage(details.uri);
            if (result.mask_base64) {
              setMainMaskUri(`data:image/png;base64,${result.mask_base64}`);
              setMainMaskPercentage(result.deforestation_percentage);
            }
          } else {
            console.error("Nenhum dado encontrado para o ID:", id);
          }
        } catch (error) {
          console.error("Erro ao buscar ou analisar detalhes:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchDataAndAnalyze();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };

  const handleYearSelect = async (year: number) => {
    if (selectedYear === year || isComparisonLoading || !favsDetails) return;

    setSelectedYear(year);
    setIsComparisonLoading(true);
    setComparisonImage(null);

    try {
      const newSatelliteImageUri = await getSentinelImagesByYear(
        favsDetails.longitude,
        favsDetails.latitude,
        year
      );

      let satelliteImageUriString = "";
      if (typeof newSatelliteImageUri === "string") {
        satelliteImageUriString = newSatelliteImageUri;
      } else if (newSatelliteImageUri instanceof ArrayBuffer) {
        const base64 = Buffer.from(newSatelliteImageUri).toString("base64");
        satelliteImageUriString = `data:image/png;base64,${base64}`;
      }

      if (!satelliteImageUriString) {
        alert(`Nenhuma imagem encontrada para o ano ${year}.`);
        setIsComparisonLoading(false);
        return;
      }

      const result = await postImage(satelliteImageUriString);

      if (result.mask_base64) {
        setComparisonImage({
          satelliteUri: satelliteImageUriString,
          maskUri: `data:image/png;base64,${result.mask_base64}`,
          percentage: result.deforestation_percentage,
        });
      }
    } catch (error) {
      console.error(`Erro ao buscar dados para o ano ${year}:`, error);
      alert(`Erro ao buscar imagem para ${year}. Tente novamente.`);
    } finally {
      setIsComparisonLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando e analisando favorito...</Text>
      </View>
    );
  }

  if (!favsDetails) {
    return (
      <View style={styles.container}>
        <Toolbar title="Erro" onPress={handleGoBack} />
        <View style={styles.centered}>
          <Text>Não foi possível carregar os detalhes do favorito.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toolbar title="Análise do Favorito" onPress={handleGoBack} />
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <Text style={styles.detailText}>
          Coordenadas: {favsDetails.latitude}, {favsDetails.longitude}
        </Text>
        <Image source={{ uri: favsDetails.uri }} style={styles.detailImage} />

        <Text style={styles.sectionTitle}>Máscara da Imagem Principal</Text>
        {mainMaskUri ? (
          <>
            <Image source={{ uri: mainMaskUri }} style={styles.detailImage} />
            {mainMaskPercentage !== null && (
              <Text style={styles.percentageText}>
                Área de desmatamento: {mainMaskPercentage.toFixed(2)}%
              </Text>
            )}
          </>
        ) : (
          <ActivityIndicator color="#007AFF" />
        )}

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
                  <Text style={styles.sectionTitle}>
                    Comparação com {selectedYear}
                  </Text>
                  <Image
                    source={{ uri: comparisonImage.satelliteUri }}
                    style={styles.detailImage}
                  />
                  <Text style={styles.sectionTitle}>
                    Máscara de {selectedYear}
                  </Text>
                  <Image
                    source={{ uri: comparisonImage.maskUri }}
                    style={styles.detailImage}
                  />
                  <Text style={styles.percentageText}>
                    Área de desmatamento:{" "}
                    {comparisonImage.percentage.toFixed(2)}%
                  </Text>

                  {mainMaskPercentage !== null && (
                    <View style={styles.summaryContainer}>
                      <Text style={styles.sectionTitle}>Resumo da Análise</Text>
                      <Text style={styles.summaryText}>
                        Desmatamento na imagem principal:{" "}
                        {mainMaskPercentage.toFixed(2)}%
                      </Text>
                      <Text style={styles.summaryText}>
                        Desmatamento em {selectedYear}:{" "}
                        {comparisonImage.percentage.toFixed(2)}%
                      </Text>
                      <Text
                        style={[styles.summaryText, styles.summaryHighlight]}
                      >
                        Variação:{" "}
                        {(
                          comparisonImage.percentage - mainMaskPercentage
                        ).toFixed(2)}
                        %
                      </Text>
                    </View>
                  )}
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
    padding: 20,
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
    borderColor: "#ccc",
    borderWidth: 1,
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
    minWidth: "23%", 
    alignItems: "center",
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
  percentageText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007AFF",
    textAlign: "center",
    marginTop: 10,
  },
  summaryContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f7f7f7",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  summaryHighlight: {
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 18,
    color: "#d9534f",
  },
});
