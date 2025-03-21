import { Alert, Image, ImageBackground, Text, View } from "react-native";
import TextInputLogin from "./components/TextInputLogin";
import styles from "./styles/login/styles";
import { IconKey, IconUser } from "@tabler/icons-react-native";
import Button from "./components/Button";
import { router } from "expo-router";
import { useState } from "react";
import { postLogin } from "./services/post/postLogin";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const response = await postLogin({ email: username, password });
      if (response) {
        Alert.alert("Logado com sucesso!");
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
        placeholder="Username"
        IconComponent={IconUser}
        onChangeText={(text) => setUsername(text)}
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
