import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Image,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";
import fetchSatelliteImage from "../../services/get/getSentinelImages";
import CoordsModal from "../../components/Modal";
import { router } from "expo-router";
//import firebase from "@react-native-firebase/app";

import firebaseApp from '../../../firebase' // caminho relativo direto

import { getAuth } from 'firebase/auth'
import { getApps } from 'firebase/app';
import ProfileScreen from "../profile/ProfileScreen";

const auth = getAuth(firebaseApp)

export default function Home() {
  const [selectedCoords, setSelectedCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
  const apps = getApps();

  if (apps.length > 0) {
    Alert.alert(
      'Firebase Conectado!',
      'O Firebase SDK foi inicializado com sucesso.'
    );
    console.log('Firebase SDK inicializado:', apps[0].name);
  } else {
    Alert.alert('Erro Firebase', 'O Firebase SDK não foi inicializado.');
  }
}, []);

  const handleCoordinateSelected = async (coords: {
    lat: number;
    lng: number;
  }) => {
    setSelectedCoords(coords);
    setModalVisible(true);

    try {
      const img = await fetchSatelliteImage(coords.lng, coords.lat);

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
          setImageUri(null); // Se for erro, não tenta carregar imagem
        } catch (e) {
          // Caso não seja JSON, tenta a base64
          const base64Image = imgString.split(",")[1];
          if (base64Image && base64Image.length > 100) {
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

      <CoordsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedCoords={selectedCoords ?? undefined}
        imageUri={imageUri ?? undefined}
        onFavorite={() => router.push("/screens/favs")}
        onAnalysis={() => router.push("/screens/analysis")}
      />
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
