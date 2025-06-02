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
} from "react-native";
import { postFavs } from "../../services/post/PostFavs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

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

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        setUserId(null);
      }
    };
    fetchUserId();
  }, []);

  const getUserId = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (userId) {
        return userId;
      } else {
        throw new Error("User ID not found in storage");
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      throw error;
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    onFavorite?.();
    console.log("Coordenadas favoritas:", userId);
    const response = postFavs({
      latitude: selectedCoords?.lat || 0,
      longitude: selectedCoords?.lng || 0,
      uri: imageUri || "",
      userId: userId || "",
    });

    response
      .then((res) => {
        console.log("Favorito adicionado com sucesso:", res);
      })
      .catch((error) => {
        console.error("Erro ao adicionar favorito:", error);
      });
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
              <Text>Latitude: {selectedCoords?.lat}</Text>
              <Text>Longitude: {selectedCoords?.lng}</Text>

              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.image} />
              ) : (
                <Text>Carregando imagem de satélite...</Text>
              )}

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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  image: {
    width: 250,
    height: 250,
    marginVertical: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "60%",
    marginVertical: 10,
  },
  actionButton: {
    backgroundColor: "#2196F3",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
});

export default CoordsModal;
