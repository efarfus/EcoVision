import { Image, ImageBackground, Text, View } from "react-native";
import TextInputLogin from "./components/TextInputLogin";
import styles from "./styles/login/styles";
import { IconKey, IconUser } from "@tabler/icons-react-native";
import Button from "./components/Button";
import { router } from "expo-router";
import { useState } from "react";
import { api } from "@/lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
      if (!email || !password) {
        alert("Todos os campos são obrigatórios!");
        return;
      }
    
      try {
        const response = await api.post("/login", {
          email,
          password,
        });
    
        if (response.status === 201) {
          router.push("/screens/home");
        }
      } catch (error: any) {
        console.error("Erro ao registrar:", error);
        alert(error.response?.data?.message || "Erro ao registrar!");
      }
    };

  return (
    <ImageBackground
      source={require("@/assets/images/maskbackground.png")}
      resizeMode="cover"
      style={styles.container}
    >
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      ></Image>
      <View style={styles.line}></View>
      <TextInputLogin
        placeholder="email"
        IconComponent={IconUser}
        onChangeText={(text) => setEmail(text)}
      ></TextInputLogin>
      <TextInputLogin
        placeholder="Password"
        IconComponent={IconKey}
        onChangeText={(text) => setPassword(text)}
      ></TextInputLogin>
      <Button
        title="Login"
        onPress={handleLogin}
      ></Button>
      <Button
        title="Sign Up"
        containerStyle={{ backgroundColor: "white" }}
        textStyle={{ color: "#17950E" }}
        onPress={() => {
          router.push("/screens/register");
        }}
      ></Button>
    </ImageBackground>
  );
}
