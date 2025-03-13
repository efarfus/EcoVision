import { Text, Touchable, TouchableOpacity, View } from "react-native";
import styles from "./styles";

type ButtonProps = {
  title: string;
};

export default function Button({ title }: ButtonProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonContainer}>
        <Text style={styles.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
