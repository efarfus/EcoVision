import { Image, ImageBackground, View } from "react-native";
import styles from "../../styles/login/styles";
import TextInputLogin from "../../components/TextInputLogin";
import { IconKey, IconMail, IconUser } from "@tabler/icons-react-native";
import { router } from "expo-router";
import Button from "../../components/Button";
import { useState } from "react";
import { api } from "@/lib/axios";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
  
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
  
    try {
      const response = await api.post("/signup", {
        email,
        password,
        name: username,
      });
  
      if (response.status === 201) {
        alert("Cadastro realizado com sucesso!");
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
        placeholder="Username"
        IconComponent={IconUser}
        onChangeText={(text) => setUsername(text)}
      ></TextInputLogin>
      <TextInputLogin
        placeholder="Email"
        IconComponent={IconMail}
        onChangeText={(text) => setEmail(text)}
      ></TextInputLogin>
      <TextInputLogin
        placeholder="Password"
        IconComponent={IconKey}
        onChangeText={(text) => setPassword(text)}
      ></TextInputLogin>
      <TextInputLogin
        placeholder="Confirm Password"
        IconComponent={IconKey}
        onChangeText={(text) => setConfirmPassword(text)}
      ></TextInputLogin>
      <Button
        containerStyle={{ marginTop: 20 }}
        title="Register"
        onPress={handleRegister}
      ></Button>
    </ImageBackground>
  );
}
