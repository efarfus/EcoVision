import { Alert, Image, ImageBackground, Text, View } from "react-native";
import TextInputLogin from "./components/TextInputLogin";
import styles from "./styles/login/styles";
import { IconKey, IconUser } from "@tabler/icons-react-native";
import Button from "./components/Button";
import { router } from "expo-router";
import { useState } from "react";
import { postLogin } from "./services/post/postLogin";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import { getIdByEmail } from "./services/get/getIdByEmail";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const response = await postLogin({ email: email, password });
      if (response) {
        Alert.alert("Logado com sucesso!");

        const getId = await getIdByEmail(email);
        if (getId) {
          console.log("ID do usuário:", getId.userId.toString());
          AsyncStorage.setItem("userId", getId.userId.toString());
        } else {
          console.error("Erro ao obter ID do usuário");
        }
        router.push("/screens/home");
      }
    } catch (error) {
      alert("Erro ao logar!");
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
        placeholder="Email"
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
        onPress={() => {
          handleLogin();
        }}
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
