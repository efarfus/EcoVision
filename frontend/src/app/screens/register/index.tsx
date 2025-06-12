import { Alert, Image, ImageBackground, View } from "react-native";
import styles from "../../styles/login/styles";
import TextInputLogin from "../../components/TextInputLogin";
import { IconKey, IconMail, IconUser } from "@tabler/icons-react-native";
import { router } from "expo-router";
import Button from "../../components/Button";
import { useState } from "react";
import { postSignUp } from "../../services/post/postSignUp";
export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    console.log("chamou")
    if (!username || !email || !password || !confirmPassword) {
      alert("Todos os campos são obrigatórios!");
      return;
    }
    console.log("chamou2")

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    try {
      console.log("chamou3")
      const response = await postSignUp(email, password, username);
      console.log('response')
      if (response) {
        Alert.alert("Registrado com sucesso!");
        router.push("/");
      }
    } catch (error) {
      alert("Erro ao registrar!");
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
        isPassword={true}
        onChangeText={(text) => setPassword(text)}
      ></TextInputLogin>
      <TextInputLogin
        placeholder="Confirm Password"
        IconComponent={IconKey}
        isPassword={true}
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
