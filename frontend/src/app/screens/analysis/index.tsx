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

interface AnalysisScreenParams {
  latitude: string;
  longitude: string;
  imageUri: string;
}

const YEARS = [2000, 2005, 2010, 2015, 2020];

export default function AnalysisScreen() {
  const params = useLocalSearchParams();

  const [initialLatitude, setInitialLatitude] = useState<number | null>(null);
  const [initialLongitude, setInitialLongitude] = useState<number | null>(null);
  const [mainImageDisplayUri, setMainImageDisplayUri] = useState<string | null>(
    null
  );
  const [mainBinaryImage, setMainBinaryImage] = useState(
    "Carregando dados binários..."
  );

  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [comparisonImage, setComparisonImage] = useState<{
    uri: string;
    binary: string;
  } | null>(null);
  const [isComparisonLoading, setIsComparisonLoading] = useState(false);
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);

  useEffect(() => {
    if (params.latitude && params.longitude && params.imageUri) {
      try {
        const latitude =
          typeof params.latitude === "string"
            ? params.latitude
            : params.latitude[0];
        const longitude =
          typeof params.longitude === "string"
            ? params.longitude
            : params.longitude[0];
        const imageUri =
          typeof params.imageUri === "string"
            ? params.imageUri
            : params.imageUri[0];

        setInitialLatitude(parseFloat(latitude));
        setInitialLongitude(parseFloat(longitude));
        setMainImageDisplayUri(imageUri);
        setMainBinaryImage(
          "dados da imagem de satélite principal (recebidos/simulados)"
        );
        setIsLoadingInitialData(false);
      } catch (error) {
        console.error("Erro ao processar parâmetros da rota:", error);
        setIsLoadingInitialData(false);
      }
    } else {
      console.warn(
        "Parâmetros necessários (latitude, longitude, imageUri) não foram recebidos para a tela de Análise."
      );
      setIsLoadingInitialData(false);
    }
  }, [params]); // Re-executa se os params mudarem

  const handleGoBack = () => {
    router.back();
  };

  const handleYearSelect = async (year: number) => {
    if (selectedYear === year) return; // Não faz nada se o mesmo ano for clicado
    if (!initialLatitude || !initialLongitude) {
      console.warn(
        "Coordenadas iniciais não disponíveis para buscar dados anuais."
      );
      return;
    }

    setSelectedYear(year);
    setIsComparisonLoading(true);
    setComparisonImage(null); // Limpa a imagem anterior

    // --- PONTO DE INTEGRAÇÃO DA SUA API DE IA ---
    // Aqui você faria a chamada para a sua API de IA, passando o 'year',
    // 'initialLatitude' e 'initialLongitude'.
    console.log(
      `Simulando busca para o ano ${year} com coordenadas: Lat ${initialLatitude}, Lng ${initialLongitude}`
    );
    setTimeout(() => {
      setComparisonImage({
        uri: `https://picsum.photos/400/300?random=${year}`, // Imagem de placeholder
        binary: `Imagem binária para o ano ${year} (dados da sua IA aqui)`,
      });
      setIsComparisonLoading(false);
    }, 1500); // Simula 1.5s de delay da rede
  };

  // Renderização de loading para os dados iniciais
  if (isLoadingInitialData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Carregando dados para análise...</Text>
      </View>
    );
  }

  // Se os dados iniciais essenciais não foram carregados (ex: faltaram params)
  if (
    initialLatitude === null ||
    initialLongitude === null ||
    !mainImageDisplayUri
  ) {
    return (
      <View style={styles.container}>
        <Toolbar title="Erro na Análise" onPress={handleGoBack} />
        <View style={styles.centered}>
          <Text>
            Não foi possível carregar os dados necessários para a análise.
          </Text>
          <Text>Verifique se os parâmetros foram passados corretamente.</Text>
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
        {/* Detalhes Iniciais (vindos dos parâmetros) */}
        <Text style={styles.detailText}>
          Coordenadas da imagem: {initialLatitude}, {initialLongitude}
        </Text>
        <Image
          source={{ uri: mainImageDisplayUri }}
          style={styles.detailImage}
        />

        <Text style={styles.sectionTitle}>
          Imagem Binária da Foto de Satélite Principal
        </Text>
        <View style={styles.binaryContainer}>
          <Text style={styles.binaryText} selectable>
            {mainBinaryImage}
          </Text>
          <Image
            source={{ uri: mainImageDisplayUri }}
            style={styles.detailImage}
          />
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
                    />
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
});
