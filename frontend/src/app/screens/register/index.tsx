import { Image, ImageBackground, View } from "react-native";
import styles from "../../styles/login/styles";
import TextInputLogin from "../../components/TextInputLogin";
import { IconKey, IconMail, IconUser } from "@tabler/icons-react-native";
import { router } from "expo-router";
import Button from "../../components/Button";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
        onPress={() => {
          router.push("/screens/home");
        }}
      ></Button>
    </ImageBackground>
  );
}
