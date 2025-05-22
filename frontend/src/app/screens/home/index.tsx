import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";
import { Button, Image, Modal, StyleSheet, Text, View } from "react-native";
import { WebView } from "react-native-webview";
import fetchSatelliteImage from "../../services/get/getSentinelImages";
import ProfileScreen from "../profile/ProfileScreen";

export default function Home() {
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handleCoordinateSelected = async (coords: { lat: number; lng: number }) => {
    setSelectedCoords(coords);
    setModalVisible(true);
  
    try {
      const img = await fetchSatelliteImage(coords.lng, coords.lat);
  
      // Log a resposta completa antes de tentar decodificar
      console.log("Resposta do fetch:", img);
  
      const imgString =
        typeof img === "string"
          ? img
          : img
          ? new TextDecoder().decode(img)
          : null;
  
      if (imgString) {
        // Verifique a resposta
        try {
          const jsonResponse = JSON.parse(imgString); // Tenta analisar como JSON
          console.log("Resposta JSON:", jsonResponse);
          setImageUri(null); // Se for erro, não tenta carregar imagem
        } catch (e) {
          // Caso não seja JSON, tenta a base64
          const base64Image = imgString.split(",")[1];
          if (base64Image && base64Image.length > 100) {
            console.log("Imagem base64 (parcial):", base64Image.substring(0, 100));
            setImageUri(`data:image/png;base64,${base64Image}`);
          } else {
            console.error("Base64 inválido ou muito curto");
            setImageUri(null);
          }
        }
      } else {
        console.error("Imagem não encontrada");
        setImageUri(null);
      }
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      setImageUri(null);
    }
  };
  
  

  return (
    <>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarActiveTintColor: "#17950E",
          tabBarInactiveTintColor: "#000000",
        }}
      >
        <Tab.Screen
          name="Home"
          children={() => (
            <LeafletMap onCoordinateSelected={handleCoordinateSelected} />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="map" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />
       <Tab.Screen
         name="Profile"
          component={ProfileScreen}
          options={{
          tabBarIcon: ({ color, size }) => (
      <Ionicons name="person" size={size} color={color} />
    ),
    headerShown: false,
  }}
/>
      </Tab.Navigator>

      {/* ✅ Modal com as coordenadas clicadas */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Coordenadas Selecionadas</Text>
            <Text>Latitude: {selectedCoords?.lat}</Text>
            <Text>Longitude: {selectedCoords?.lng}</Text>

            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: 250, height: 250, marginVertical: 10 }}
              />
            ) : (
              <Text>Carregando imagem de satélite...</Text>
            )}

            <Button title="Fechar" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  );
}

type LeafletMapProps = {
  onCoordinateSelected: (coords: { lat: number; lng: number }) => void;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ onCoordinateSelected }) => {
  const leafletHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map { height: 100%; width: 100%; }
          body, html { margin: 0; padding: 0; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([-3.119028, -60.021731], 13);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          L.marker([-3.119028, -60.021731]).addTo(map).bindPopup('Manaus - AM').openPopup();

          map.on('click', function(e) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              lat: e.latlng.lat,
              lng: e.latlng.lng
            }));
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html: leafletHTML }}
      style={{ flex: 1 }}
      onMessage={(event) => {
        const coords = JSON.parse(event.nativeEvent.data);
        onCoordinateSelected(coords);
      }}
    />
  );
};

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
