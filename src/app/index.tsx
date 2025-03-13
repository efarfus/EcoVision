import { Text, View } from "react-native";
import TextInputLogin from "./components/TextInputLogin";
import styles from "./styles";
import { IconKey, IconUser } from "@tabler/icons-react-native"
import Button from "./components/Button";

export default function Login() {
  return (
    <View style={styles.container}>
      <TextInputLogin placeholder="Username" IconComponent={IconUser}></TextInputLogin>
      <TextInputLogin placeholder="Password" IconComponent={IconKey}></TextInputLogin>
      <Button title="Login"></Button>
    </View>
  );
}
