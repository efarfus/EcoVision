import { Text, TextInput, View } from "react-native";
import { IconUser } from "@tabler/icons-react-native";
import styles from "./styles";

type TextInputLoginProps = {
  placeholder: string;
};

export default function TextInputLogin({ placeholder }: TextInputLoginProps) {
  return (
    <View style={styles.container}>
      <IconUser size={24} color="#000000" strokeWidth={0.5}></IconUser>
      <TextInput style={styles.textInput} placeholder={placeholder}></TextInput>
    </View>
  );
}
