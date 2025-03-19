import React from "react";
import { View, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { styles } from "../../styles/home";

const Tab = createBottomTabNavigator();

export default function Home() {
  return (
    <Tab.Navigator
      initialRouteName="Home" 
      screenOptions={{
        tabBarActiveTintColor: "#17950E", 
        tabBarInactiveTintColor: "#000000",
      }}//a
    >
      <Tab.Screen
        name="Home"
        component={() => (
          <View style={styles.container}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: -3.119028,
                longitude: -60.021731,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{ latitude: -3.119028, longitude: -60.021731 }}
                title="Manaus - AM"
                description="Localização inicial no Amazonas"
              />
            </MapView>
          </View>
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
        component={() => (
          <View style={styles.container}>
            <Text>Perfil</Text>
          </View>
        )}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerShown: false, 
        }}
      />
    </Tab.Navigator>
  );
}
