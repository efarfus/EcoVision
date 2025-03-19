import { Image, ImageBackground, Text, View } from "react-native";
import TextInputLogin from "./components/TextInputLogin";
import styles from "./styles/login/styles";
import { IconKey, IconUser } from "@tabler/icons-react-native";
import Button from "./components/Button";
import { router } from "expo-router";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
          router.push("/screens/home");
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
