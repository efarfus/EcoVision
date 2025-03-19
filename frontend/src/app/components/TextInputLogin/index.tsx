import { TextInput, View } from "react-native";
import styles from "./styles";

type TextInputLoginProps = {
  placeholder: string;
  IconComponent: React.ElementType;
  onChangeText: (text: string) => void;
};

export default function TextInputLogin({
  placeholder,
  IconComponent,
  onChangeText,
}: TextInputLoginProps) {
  return (
    <View style={styles.container}>
      {IconComponent && (
        <IconComponent size={24} color="#000000" strokeWidth={1} />
      )}
      <TextInput
        style={styles.textInput}
        placeholder={placeholder}
        onChangeText={onChangeText}
      />
    </View>
  );
}
