import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateUser } from "../../services/post/UpdateUser/updateUser";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../../services/api";

interface User {
  name: string;
  email: string;
  password?: string; // Senha é opcional, pois talvez você não queira exibi-la
  id: string;
}

export default function ProfileScreen() {
  const [email, setEmail] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await getUserId();
        setUserId(id);
      } catch (error) {
        setUserId(null);
        setLoading(false); 
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (!userId) {
        setLoading(false); 
        return;
      }
      try {
        const response = await api.get(`/user/${userId}`);
        console.log("User data fetched:", response.data);
        const fetchedUser: User = response.data.identifiedUser;
        setEmail(fetchedUser.email);
        setUsuario(fetchedUser.name);
        setSenha(""); 

        setLoading(false); 
      } catch (err) {
        console.error("Error fetching user data: ", err);
        Alert.alert(
          "Erro",
          "Não foi possível carregar os dados do usuário."
        );
        setLoading(false); 
      }
    }
    fetchUser();
  }, [userId]); 

  const getUserId = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        return storedUserId;
      } else {
        throw new Error("User ID not found in storage");
      }
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      throw error;
    }
  };

  const handleAtualizar = async () => {
    if (!usuario || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    try {
      await updateUser(email, usuario, senha, userId);
      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    }
  };

  const handleExcluirConta = () => {
    Alert.alert("Aviso", "Deseja realmente excluir sua conta?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => Alert.alert("Conta excluída"),
      },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Você saiu da conta!");
  };

  const handleGoToFavs = () => {
    router.push("/screens/favs");
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#000" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Perfil</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={usuario}
          onChangeText={setUsuario}
          placeholderTextColor="#888"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#888"
          keyboardType="email-address" 
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Senha (deixe em branco para manter a atual)" 
            value={senha}
            onChangeText={setSenha}
            secureTextEntry={!senhaVisivel}
            placeholderTextColor="#888"
          />
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Ionicons
              name={senhaVisivel ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#888"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.favsButton} onPress={handleGoToFavs}>
          <Ionicons name="bookmark-outline" size={22} color="#17950E" />
          <Text style={styles.favsButtonText}>Meus Favoritos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton} onPress={handleAtualizar}>
          <Text style={styles.updateButtonText}>Atualizar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleExcluirConta}
        >
          <Text style={styles.deleteButtonText}>Excluir conta</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    padding: 20,
    paddingBottom: 140,
  },
  logoutButton: {
    alignSelf: "flex-end",
    padding: 15,
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    alignSelf: "center",
    marginTop: 60,
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    color: "#000",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    color: "#000",
  },
  favsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#17950E",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  favsButtonText: {
    color: "#17950E",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  updateButton: {
    backgroundColor: "#17950E",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#fff",
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 18,
    color: "#888",
  },
});