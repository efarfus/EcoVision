import React from "react";
import { View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { styles } from "../../styles/home";

export default function Home() {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -23.55052,  // Latitude inicial (São Paulo)
          longitude: -46.633308, // Longitude inicial
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{ latitude: -23.55052, longitude: -46.633308 }}
          title="Teste de Localização"
          description="Esse é um marcador de teste"
        />
      </MapView>
    </View>
  );
}
