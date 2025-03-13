import { Image, Text, View } from "react-native";
import TextInputLogin from "./components/TextInputLogin";
import styles from "./styles/login";
import { IconKey, IconUser } from "@tabler/icons-react-native";
import Button from "./components/Button";
import { router } from "expo-router";

export default function Login() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      ></Image>
      <View style={styles.line}></View>
      <TextInputLogin
        placeholder="Username"
        IconComponent={IconUser}
      ></TextInputLogin>
      <TextInputLogin
        placeholder="Password"
        IconComponent={IconKey}
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
      ></Button>
    </View>
  );
}
