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
import { postImage } from "../../servicesIA/post";
import getSentinelImagesByYear from "../../services/get/getSentinelImagesByYear";
import { Buffer } from "buffer";
import { IconStar, IconStarFilled } from "@tabler/icons-react-native";
import { postFavs } from "../../services/post/PostFavs";
import AsyncStorage from "@react-native-async-storage/async-storage";

const YEARS = [2017, 2018, 2019, 2020, 2021];

export default function AnalysisScreen() {
  const params = useLocalSearchParams();
  const [mainMaskPercentage, setMainMaskPercentage] = useState<number | null>(
    null
  );
  const [initialLatitude, setInitialLatitude] = useState<number | null>(null);
  const [initialLongitude, setInitialLongitude] = useState<number | null>(null);
  const [mainImageDisplayUri, setMainImageDisplayUri] = useState<string | null>(
    null
  );
  const [mainMaskUri, setMainMaskUri] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [comparisonImage, setComparisonImage] = useState<{
    satelliteUri: string;
    maskUri: string;
    percentage: number;
  } | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Função para obter o userId do AsyncStorage
  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        return storedUserId;
      } else {
        throw new Error("User ID not found in storage");
      }
    } catch (error) {
      console.error("Erro ao obter ID do usuário:", error);
      return null;
    }
  };

  useEffect(() => {
    getUserId()
      .then((id) => {
        if (id) {
          setUserId(id);
        } else {
          console.warn("User ID not found in storage");
        }
      })
      .catch((error) => {
        console.error("Error fetching user ID:", error);
      });
  }, []);

  const handleFavorite = async () => {
    if (
      !initialLatitude ||
      !initialLongitude ||
      !mainImageDisplayUri ||
      !userId
    ) {
      alert("Não é possível favoritar: dados incompletos.");
      return;
    }

    // Inverte o estado para dar feedback visual
    setIsFavorite(!isFavorite);

    try {
      // Envia para a API apenas se não estiver favoritado ainda
      if (!isFavorite) {
        await postFavs({
          latitude: initialLatitude,
          longitude: initialLongitude,
          uri: mainImageDisplayUri,
          userId: userId,
        });
        alert("Local salvo nos seus favoritos!");
      } else {
        alert("Local removido dos favoritos.");
      }
    } catch (error) {
      console.error("Erro ao favoritar:", error);
      alert("Ocorreu um erro ao salvar o favorito.");
      setIsFavorite(isFavorite);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (params.latitude && params.longitude && params.imageUri) {
        try {
          const imageUri =
            typeof params.imageUri === "string"
              ? params.imageUri
              : params.imageUri[0];

          setInitialLatitude(parseFloat(params.latitude as string));
          setInitialLongitude(parseFloat(params.longitude as string));
          setMainImageDisplayUri(imageUri);

          const result = await postImage(imageUri);
          if (result.mask_base64) {
            setMainMaskUri(`data:image/png;base64,${result.mask_base64}`);
            setMainMaskPercentage(result.deforestation_percentage);
          }
        } catch (error) {
          console.error(
            "Erro ao processar dados iniciais ou chamar API:",
            error
          );
        } finally {
          setIsLoadingInitialData(false);
        }
      } else {
        console.warn("Parâmetros necessários não foram recebidos.");
        setIsLoadingInitialData(false);
      }
    };

    fetchInitialData();
  }, [params]);

  const handleGoBack = () => {
    router.back();
  };

  const handleYearSelect = async (year: number) => {
    if (selectedYear === year || isComparisonLoading) return;
    if (!initialLatitude || !initialLongitude) return;

    setSelectedYear(year);
    setIsComparisonLoading(true);
    setComparisonImage(null);

    try {
      const newSatelliteImageUri = await getSentinelImagesByYear(
        initialLongitude,
        initialLatitude,
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
        setComparisonImage(null);
        setIsComparisonLoading(false);
        alert(`Nenhuma imagem encontrada para o ano ${year}.`);
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

  if (isLoadingInitialData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Analisando imagem inicial...</Text>
      </View>
    );
  }

  if (!mainImageDisplayUri) {
    return (
      <View style={styles.container}>
        <Toolbar title="Erro na Análise" onPress={handleGoBack} />
        <View style={styles.centered}>
          <Text>Não foi possível carregar os dados.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Toolbar title="Análise de Imagem" onPress={handleGoBack} />
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.detailText}>
            Coordenadas: {initialLatitude?.toFixed(4)},{" "}
            {initialLongitude?.toFixed(4)}
          </Text>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={handleFavorite}
          >
            {isFavorite ? (
              <IconStarFilled size={28} color="#FFD700" />
            ) : (
              <IconStar size={28} color="#ccc" />
            )}
          </TouchableOpacity>
        </View>
        <Image
          source={{ uri: mainImageDisplayUri }}
          style={styles.detailImage}
        />

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
          <Text>Máscara não disponível.</Text>
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
                  {mainMaskPercentage !== null && (
                    <Text style={styles.percentageText}>
                      Área de desmatamento:{" "}
                      {comparisonImage.percentage.toFixed(2)}%
                    </Text>
                  )}
                </>
              )
            )}
            {mainMaskPercentage !== null && (
              <View style={styles.summaryContainer}>
                <Text style={styles.sectionTitle}>Resumo da Análise</Text>
                <Text style={styles.summaryText}>
                  Desmatamento na imagem principal:{" "}
                  {mainMaskPercentage.toFixed(2)}%
                </Text>
                <Text style={styles.summaryText}>
                  Desmatamento em {selectedYear}:{" "}
                  {comparisonImage
                    ? comparisonImage.percentage.toFixed(2)
                    : "--"}
                  %
                </Text>
                <Text style={[styles.summaryText, styles.summaryHighlight]}>
                  Variação:{" "}
                  {comparisonImage
                    ? (comparisonImage.percentage - mainMaskPercentage).toFixed(
                        2
                      )
                    : "--"}
                  %
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    flex: 1, // Permite que o texto cresça e empurre o botão
  },
  favoriteButton: {
    padding: 8,
  },
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
  binaryContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    minHeight: 80,
    justifyContent: "center",
    marginBottom: 10,
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
    minWidth: "18%",
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
