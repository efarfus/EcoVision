import {
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import styles from "./styles";

type ButtonProps = {
  title: string;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
};

export default function Button({
  title,
  containerStyle,
  textStyle,
  onPress,
}: ButtonProps) {
  return (
    <View style={[styles.container]}>
      <TouchableOpacity
        style={[styles.buttonContainer, containerStyle]}
        onPress={onPress}
      >
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}
