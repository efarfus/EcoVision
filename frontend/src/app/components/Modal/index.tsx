import {
  IconReportAnalytics,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react-native";
import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { postFavs } from "../../services/post/PostFavs";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CoordsModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCoords?: { lat: number; lng: number };
  imageUri?: string;
  onFavorite?: () => void;
  onAnalysis?: () => void;
}

const CoordsModal = ({
  visible,
  onClose,
  selectedCoords,
  imageUri,
  onFavorite,
  onAnalysis,
}: CoordsModalProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Hook para buscar o ID do usuário quando o modal se torna visível
  useEffect(() => {
    if (visible) {
      const fetchUserId = async () => {
        try {
          const id = await getUserId();
          setUserId(id);
        } catch (error) {
          console.error("Falha ao buscar userId no modal:", error);
          setUserId(null);
        }
      };
      fetchUserId();
      // Reseta o estado 'isFavorite' toda vez que o modal abre
      setIsFavorite(false);
    }
  }, [visible]);

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        return storedUserId;
      } else {
        throw new Error("User ID não encontrado no AsyncStorage");
      }
    } catch (error) {
      // O erro já será logado, então apenas relançamos para o catch do chamador
      throw error;
    }
  };

  const handleFavorite = () => {
    // Inverte o estado para feedback visual imediato
    setIsFavorite(!isFavorite);
    
    // Chama a função de favoritar apenas se não estiver já favoritado
    if (!isFavorite && selectedCoords && imageUri && userId) {
        postFavs({
          latitude: selectedCoords.lat,
          longitude: selectedCoords.lng,
          uri: imageUri,
          userId: userId,
        })
        .then((res) => {
          console.log("Favorito adicionado com sucesso:", res);
          // Chama a prop onFavorite, se existir (pode ser usada para navegação, etc.)
          onFavorite?.();
        })
        .catch((error) => {
          console.error("Erro ao adicionar favorito:", error);
          // Desfaz a mudança visual em caso de erro
          setIsFavorite(false); 
        });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Coordenadas Selecionadas</Text>
              {selectedCoords && (
                <>
                  <Text>Latitude: {selectedCoords.lat.toFixed(4)}</Text>
                  <Text>Longitude: {selectedCoords.lng.toFixed(4)}</Text>
                </>
              )}

              {/* Área da Imagem com Loading */}
              <View style={styles.imageContainer}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.image} />
                ) : (
                  <ActivityIndicator size="large" color="#2196F3" />
                )}
              </View>

              {/* Botões Condicionais */}
              {imageUri ? (
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleFavorite}
                  >
                    {isFavorite ? (
                      <IconStarFilled color="white" strokeWidth={2} size={24} />
                    ) : (
                      <IconStar color="white" strokeWidth={2} size={24} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={onAnalysis}
                  >
                    <IconReportAnalytics
                      color="white"
                      strokeWidth={2}
                      size={24}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                // Renderiza uma View vazia para manter o layout estável
                <View style={styles.buttonRow} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageContainer: {
    width: 224,
    height: 224,
    marginVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "60%",
    height: 60, // Altura fixa para evitar "pulos" no layout
    alignItems: 'center',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    elevation: 3,
  },
});

export default CoordsModal;